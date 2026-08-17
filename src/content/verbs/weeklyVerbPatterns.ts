/**
 * RESEARCH / CANDIDATE ONLY — NOT LEARNER-FACING.
 *
 * ROMANIAN LANGUAGE DATA IS GOVERNED.
 * Pattern-built conjugations require external lexical verification before any learner use.
 * Verified forms live in `verifiedVerbForms.ts`.
 *
 * See: docs/LANGUAGE_DATA_GOVERNANCE.md
 */
import type { GrammarVerb, VerbForm, ColorKey } from '../../types';
import type { ValidationProvenance } from '../validation/provenance';

const LABELS = ['eu', 'tu', 'el/ea', 'noi', 'voi', 'ei/ele'] as const;

export type VerbConjugationClass =
  | 'a-regular'
  | 'a-consonant'
  | 'ui'
  | 'i-simple'
  | 'i-esc'
  | 'e'
  | 'î'
  | 'irregular';

export interface WeeklyVerbSpec {
  infinitive: string;
  en: string;
  class: VerbConjugationClass;
  present?: [string, string, string][];
  participle?: string;
  imperfectStem?: string;
  provenance: ValidationProvenance;
  icon?: string;
  color?: ColorKey;
}

function vf(rows: [string, string, string][]): VerbForm[] {
  return rows.map(([ro, en, pron], i) => ({
    label: LABELS[i] ?? `p${i}`,
    ro,
    en,
    pron: pron || ro,
  }));
}

function stem(infinitive: string): string {
  return infinitive.replace(/^a\s+/, '').replace(/î$/, 'i');
}

function presentARegular(inf: string): [string, string, string][] {
  const s = stem(inf);
  const base = s.endsWith('a') ? s.slice(0, -1) : s;
  return [
    [`${base}ez`, 'I ...', `${base}ez`],
    [`${base}ezi`, 'you ...', `${base}ezi`],
    [`${base}ează`, 'he/she ...', `${base}ează`],
    [`${base}ăm`, 'we ...', `${base}ăm`],
    [`${base}ați`, 'you (pl.) ...', `${base}ați`],
    [`${base}ează`, 'they ...', `${base}ează`],
  ];
}

function presentAConsonant(inf: string): [string, string, string][] {
  const s = stem(inf);
  const base = s.endsWith('a') ? s.slice(0, -1) : s;
  return [
    [`${base}esc`, 'I ...', `${base}esc`],
    [`${base}ești`, 'you ...', `${base}ești`],
    [`${base}ește`, 'he/she ...', `${base}ește`],
    [`${base}im`, 'we ...', `${base}im`],
    [`${base}iți`, 'you (pl.) ...', `${base}iți`],
    [`${base}esc`, 'they ...', `${base}esc`],
  ];
}

function presentUi(inf: string): [string, string, string][] {
  const base = stem(inf);
  return [
    [`${base}esc`, 'I ...', `${base}esc`],
    [`${base}ești`, 'you ...', `${base}ești`],
    [`${base}ește`, 'he/she ...', `${base}ește`],
    [`${base}im`, 'we ...', `${base}im`],
    [`${base}iți`, 'you (pl.) ...', `${base}iți`],
    [`${base}esc`, 'they ...', `${base}esc`],
  ];
}

function presentISimple(inf: string): [string, string, string][] {
  const base = stem(inf);
  const root = base.endsWith('i') ? base.slice(0, -1) : base;
  return [
    [`${root}`, 'I ...', root],
    [`${root}i`, 'you ...', `${root}i`],
    [`${root}e`, 'he/she ...', `${root}e`],
    [`${root}im`, 'we ...', `${root}im`],
    [`${root}iți`, 'you (pl.) ...', `${root}iți`],
    [`${root}`, 'they ...', root],
  ];
}

function presentIEsc(inf: string): [string, string, string][] {
  const base = stem(inf);
  const root = base.endsWith('i') ? base.slice(0, -1) : base;
  return [
    [`${root}esc`, 'I ...', `${root}esc`],
    [`${root}ești`, 'you ...', `${root}ești`],
    [`${root}ește`, 'he/she ...', `${root}ește`],
    [`${root}im`, 'we ...', `${root}im`],
    [`${root}iți`, 'you (pl.) ...', `${root}iți`],
    [`${root}esc`, 'they ...', `${root}esc`],
  ];
}

function presentE(inf: string): [string, string, string][] {
  const base = stem(inf);
  const root = base.endsWith('e') ? base.slice(0, -1) : base;
  return [
    [`${root}`, 'I ...', root],
    [`${root}i`, 'you ...', `${root}i`],
    [`${root}e`, 'he/she ...', `${root}e`],
    [`${root}em`, 'we ...', `${root}em`],
    [`${root}eți`, 'you (pl.) ...', `${root}eți`],
    [`${root}`, 'they ...', root],
  ];
}

function presentHat(inf: string): [string, string, string][] {
  const base = inf.replace(/^a\s+/, '').replace(/î$/, '');
  return [
    [`${base}`, 'I ...', base],
    [`${base}i`, 'you ...', `${base}i`],
    [`${base}ă`, 'he/she ...', `${base}ă`],
    [`${base}âm`, 'we ...', `${base}âm`],
    [`${base}âți`, 'you (pl.) ...', `${base}âți`],
    [`${base}ă`, 'they ...', `${base}ă`],
  ];
}

function participleFor(spec: WeeklyVerbSpec): string {
  if (spec.participle) return spec.participle;
  const s = stem(spec.infinitive);
  if (spec.class === 'e') return s.endsWith('e') ? s.slice(0, -1) + 's' : s + 's';
  if (spec.class === 'i-simple' || spec.class === 'i-esc') return s + 'it';
  if (spec.class === 'ui') return s + 'it';
  if (spec.class === 'î') return s.replace(/i$/, '') + 'ât';
  return s.endsWith('a') ? s.slice(0, -1) + 'at' : s + 'at';
}

function imperfectFor(spec: WeeklyVerbSpec, presentRows: [string, string, string][]): VerbForm[] {
  const impStem = spec.imperfectStem ?? stem(spec.infinitive).replace(/a$/, '');
  const endings = ['am', 'ai', 'a', 'am', 'ați', 'au'];
  return vf(
    endings.map((end, i) => {
      const ro = `${impStem}${end}`;
      return [ro, presentRows[i]?.[1] ?? '...', ro];
    })
  );
}

function perfectCompusFor(spec: WeeklyVerbSpec): VerbForm[] {
  const part = participleFor(spec);
  const aux = [
    ['am', 'I ...', 'ahm'],
    ['ai', 'you ...', 'ay'],
    ['a', 'he/she ...', 'ah'],
    ['am', 'we ...', 'ahm'],
    ['ați', 'you (pl.) ...', 'uh-ts'],
    ['au', 'they ...', 'ow'],
  ] as [string, string, string][];
  return vf(aux.map(([a, en, pron]) => [`${a} ${part}`, en, `${pron} ${part}`]));
}

function futureFor(presentRows: [string, string, string][]): VerbForm[] {
  return vf(presentRows.map(([ro, en, pron]) => [`o să ${ro}`, en, `oh suh ${pron}`]));
}

export function buildPresent(spec: WeeklyVerbSpec): [string, string, string][] {
  if (spec.present) return spec.present;
  switch (spec.class) {
    case 'a-regular':
      return presentARegular(spec.infinitive);
    case 'a-consonant':
      return presentAConsonant(spec.infinitive);
    case 'ui':
      return presentUi(spec.infinitive);
    case 'i-simple':
      return presentISimple(spec.infinitive);
    case 'i-esc':
      return presentIEsc(spec.infinitive);
    case 'e':
      return presentE(spec.infinitive);
    case 'î':
      return presentHat(spec.infinitive);
    default:
      return presentARegular(spec.infinitive);
  }
}

const EN_LABEL: Record<string, string> = {
  eu: 'I',
  tu: 'you',
  'el/ea': 'he/she',
  noi: 'we',
  voi: 'you (pl.)',
  'ei/ele': 'they',
};

/** @internal Candidate tense builders — not learner-facing */
export const weeklyVerbCandidateBuilders = {
  imperfectFor,
  perfectCompusFor,
  futureFor,
  participleFor,
};

export function weeklyVerbToGrammarVerb(id: string, spec: WeeklyVerbSpec): GrammarVerb & { provenance: ValidationProvenance } {
  const presentRows = buildPresent(spec);
  const enBase = spec.en.replace(/^to\s+/, '');
  const present = vf(
    presentRows.map(([ro, , pron], i) => {
      const who = EN_LABEL[LABELS[i]!] ?? '';
      return [ro, `${who} ${enBase}`.trim(), pron];
    })
  );
  return {
    id,
    infinitive: spec.infinitive,
    en: spec.en,
    icon: spec.icon ?? 'Zap',
    color: spec.color ?? 'sea',
    present,
    examples: [],
    provenance: 'pattern-inferred',
  };
}

export const weeklyVerbSpecs: WeeklyVerbSpec[] = [
  { infinitive: 'a construi', en: 'to build', class: 'ui', participle: 'construit', provenance: 'verb-handbook' },
  { infinitive: 'a munci', en: 'to work', class: 'a-consonant', participle: 'muncit', provenance: 'verb-handbook' },
  { infinitive: 'a găti', en: 'to cook', class: 'a-consonant', present: [['gătesc', 'I cook', 'guh-TESK'], ['gătești', 'you cook', 'guh-TESHT'], ['gătește', 'he/she cooks', 'guh-TESHT'], ['gătim', 'we cook', 'guh-TEEM'], ['gătiți', 'you (pl.) cook', 'guh-TEETS'], ['gătesc', 'they cook', 'guh-TESK']], participle: 'gătit', provenance: 'verb-handbook' },
  { infinitive: 'a pune', en: 'to put', class: 'irregular', present: [['pun', 'I put', 'POON'], ['pui', 'you put', 'POO-ee'], ['pune', 'he/she puts', 'POO-neh'], ['punem', 'we put', 'poo-NEM'], ['puneți', 'you (pl.) put', 'poo-NETS'], ['pun', 'they put', 'POON']], participle: 'pus', imperfectStem: 'pune', provenance: 'verb-handbook' },
  { infinitive: 'a tăia', en: 'to cut', class: 'irregular', present: [['tăi', 'I cut', 'TUH-y'], ['tai', 'you cut', 'TAY'], ['taie', 'he/she cuts', 'TIE-eh'], ['tăiem', 'we cut', 'TUH-yem'], ['tăiați', 'you (pl.) cut', 'TUH-yahts'], ['tăi', 'they cut', 'TUH-y']], participle: 'tăiat', imperfectStem: 'tăia', provenance: 'verb-handbook' },
  { infinitive: 'a săpa', en: 'to dig', class: 'a-consonant', participle: 'săpat', provenance: 'verb-handbook' },
  { infinitive: 'a urca', en: 'to climb / go up', class: 'a-regular', provenance: 'verb-handbook' },
  { infinitive: 'a coborî', en: 'to go down', class: 'î', present: [['cobor', 'I go down', 'koh-BOR'], ['cobori', 'you go down', 'koh-BOR-ee'], ['coboară', 'he/she goes down', 'koh-BWAH-ruh'], ['coborâm', 'we go down', 'koh-boh-RAHM'], ['coborâți', 'you (pl.) go down', 'koh-boh-RTS'], ['coboară', 'they go down', 'koh-BWAH-ruh']], participle: 'coborât', provenance: 'verb-handbook' },
  { infinitive: 'a ridica', en: 'to lift / raise', class: 'a-regular', provenance: 'verb-handbook' },
  { infinitive: 'a căra', en: 'to carry', class: 'a-regular', provenance: 'verb-handbook' },
  { infinitive: 'a uda', en: 'to water', class: 'a-regular', provenance: 'verb-handbook' },
  { infinitive: 'a hrăni', en: 'to feed', class: 'a-consonant', participle: 'hrănit', provenance: 'verb-handbook' },
  { infinitive: 'a aduna', en: 'to gather', class: 'a-regular', provenance: 'verb-handbook' },
  { infinitive: 'a înșuruba', en: 'to screw in', class: 'a-regular', provenance: 'verb-handbook' },
  { infinitive: 'a tunde', en: 'to trim / mow', class: 'a-consonant', participle: 'tuns', provenance: 'verb-handbook' },
  { infinitive: 'a campa', en: 'to camp', class: 'a-regular', provenance: 'verb-handbook' },
  { infinitive: 'a monta', en: 'to assemble / set up', class: 'a-regular', provenance: 'verb-handbook' },
  { infinitive: 'a strânge', en: 'to tighten / gather', class: 'e', present: [['strâng', 'I gather', 'STRUHNG'], ['strângi', 'you gather', 'STRUHNG-ee'], ['strânge', 'he/she gathers', 'STRUHN-jeh'], ['strângem', 'we gather', 'struhn-JEM'], ['strângeți', 'you (pl.) gather', 'struhn-JETS'], ['strâng', 'they gather', 'STRUHNG']], participle: 'strâns', provenance: 'verb-handbook' },
  { infinitive: 'a aprinde', en: 'to light / turn on', class: 'e', present: [['aprind', 'I light', 'ah-PREEND'], ['aprinzi', 'you light', 'ah-PREENZ'], ['aprinde', 'he/she lights', 'ah-PREEN-deh'], ['aprindem', 'we light', 'ah-preen-DEM'], ['aprindeți', 'you (pl.) light', 'ah-preen-DETS'], ['aprind', 'they light', 'ah-PREEND']], participle: 'aprins', provenance: 'verb-handbook' },
  { infinitive: 'a stinge', en: 'to extinguish / turn off', class: 'e', present: [['sting', 'I turn off', 'STEENG'], ['stingi', 'you turn off', 'STEENG-ee'], ['stinge', 'he/she turns off', 'STEEN-jeh'], ['stingem', 'we turn off', 'steen-JEM'], ['stingeți', 'you (pl.) turn off', 'steen-JETS'], ['sting', 'they turn off', 'STEENG']], participle: 'stins', provenance: 'verb-handbook' },
  { infinitive: 'a dormi', en: 'to sleep', class: 'i-simple', present: [['dorm', 'I sleep', 'DORM'], ['dormi', 'you sleep', 'DOR-mee'], ['doarme', 'he/she sleeps', 'DWAR-meh'], ['dormim', 'we sleep', 'dor-MEEM'], ['dormiți', 'you (pl.) sleep', 'dor-MEETS'], ['dorm', 'they sleep', 'DORM']], participle: 'dormit', provenance: 'verb-handbook' },
  { infinitive: 'a împacheta', en: 'to pack', class: 'a-regular', provenance: 'verb-handbook' },
  { infinitive: 'a ploua', en: 'to rain', class: 'a-regular', present: [['plou', 'it rains (I rain)', 'PLOH'], ['plouă', 'it rains', 'PLOH-uh'], ['plouă', 'it rains', 'PLOH-uh'], ['plouă', 'it rains', 'PLOH-uh'], ['plouă', 'it rains', 'PLOH-uh'], ['plouă', 'it rains', 'PLOH-uh']], participle: 'plouat', provenance: 'essential-grammar' },
  { infinitive: 'a înota', en: 'to swim', class: 'a-regular', provenance: 'verb-handbook' },
  { infinitive: 'a plimba', en: 'to walk (someone/something)', class: 'a-regular', provenance: 'verb-handbook' },
  { infinitive: 'a alerga', en: 'to run', class: 'a-regular', provenance: 'verb-handbook' },
  { infinitive: 'a se juca', en: 'to play', class: 'a-regular', present: [['mă joc', 'I play', 'muh ZHOK'], ['te joci', 'you play', 'teh ZHOCH'], ['se joacă', 'he/she plays', 'seh WAH-kuh'], ['ne jucăm', 'we play', 'neh zhoo-KUHM'], ['vă jucați', 'you (pl.) play', 'vuh zhoo-KAHTS'], ['se joacă', 'they play', 'seh WAH-kuh']], participle: 'jucat', provenance: 'essential-grammar' },
  { infinitive: 'a lătra', en: 'to bark', class: 'a-regular', provenance: 'verb-handbook' },
  { infinitive: 'a mușca', en: 'to bite', class: 'a-consonant', participle: 'mușcat', provenance: 'verb-handbook' },
  { infinitive: 'a mirosi', en: 'to smell', class: 'i-esc', provenance: 'verb-handbook' },
  { infinitive: 'a asculta', en: 'to listen', class: 'a-regular', provenance: 'verb-handbook' },
  { infinitive: 'a iubi', en: 'to love', class: 'i-esc', provenance: 'verb-handbook' },
  { infinitive: 'a mângâia', en: 'to stroke / pet', class: 'ui', provenance: 'verb-handbook' },
  { infinitive: 'a se teme', en: 'to be afraid', class: 'e', present: [['mă tem', 'I am afraid', 'muh TEM'], ['te temi', 'you are afraid', 'teh TEM-ee'], ['se teme', 'he/she is afraid', 'seh TEH-meh'], ['ne temem', 'we are afraid', 'neh teh-MEM'], ['vă temeți', 'you (pl.) are afraid', 'vuh teh-METS'], ['se tem', 'they are afraid', 'seh TEM']], participle: 'temut', provenance: 'essential-grammar' },
  { infinitive: 'a se înțelege', en: 'to get along', class: 'e', present: [['mă înțeleg', 'I get along', 'muh uhn-tseh-LEG'], ['te înțelegi', 'you get along', 'teh uhn-tseh-LEG'], ['se înțelege', 'he/she gets along', 'seh uhn-tseh-LEH-jeh'], ['ne înțelegem', 'we get along', 'neh uhn-tseh-leh-JEM'], ['vă înțelegeți', 'you (pl.) get along', 'vuh uhn-tseh-leh-JETS'], ['se înțeleg', 'they get along', 'seh uhn-tseh-LEG']], participle: 'înțeles', provenance: 'essential-grammar' },
  { infinitive: 'a conduce', en: 'to drive', class: 'e', present: [['conduc', 'I drive', 'kon-DOOK'], ['conduci', 'you drive', 'kon-DOOCH'], ['conduce', 'he/she drives', 'kon-DOO-cheh'], ['conducem', 'we drive', 'kon-DOO-chem'], ['conduceți', 'you (pl.) drive', 'kon-DOO-chets'], ['conduc', 'they drive', 'kon-DOOK']], participle: 'condus', provenance: 'verb-handbook' },
  { infinitive: 'a parca', en: 'to park', class: 'a-regular', present: [['parchez', 'I park', 'PAR-keh'], ['parchezi', 'you park', 'PAR-kez'], ['parchează', 'he/she parks', 'PAR-kyah-zuh'], ['parcăm', 'we park', 'par-KUHM'], ['parcați', 'you (pl.) park', 'par-KAHTS'], ['parchează', 'they park', 'PAR-kyah-zuh']], provenance: 'verb-handbook' },
  { infinitive: 'a opri', en: 'to stop', class: 'i-esc', provenance: 'verb-handbook' },
  { infinitive: 'a porni', en: 'to start', class: 'i-esc', provenance: 'verb-handbook' },
  { infinitive: 'a vira', en: 'to turn', class: 'a-regular', present: [['virez', 'I turn', 'vee-REZ'], ['virizi', 'you turn', 'vee-REEZ'], ['virează', 'he/she turns', 'vee-RYAH-zuh'], ['virăm', 'we turn', 'vee-RUHM'], ['virați', 'you (pl.) turn', 'vee-RAHTS'], ['virează', 'they turn', 'vee-RYAH-zuh']], provenance: 'verb-handbook' },
  { infinitive: 'a depăși', en: 'to overtake', class: 'i-esc', provenance: 'verb-handbook' },
  { infinitive: 'a frâna', en: 'to brake', class: 'a-regular', present: [['frânez', 'I brake', 'FRUH-nez'], ['frânezi', 'you brake', 'FRUH-nez'], ['frânează', 'he/she brakes', 'FRUH-nyah-zuh'], ['frânăm', 'we brake', 'FRUH-nuhm'], ['frânați', 'you (pl.) brake', 'FRUH-nahts'], ['frânează', 'they brake', 'FRUH-nyah-zuh']], provenance: 'verb-handbook' },
  { infinitive: 'a accelera', en: 'to accelerate', class: 'a-regular', provenance: 'verb-handbook' },
  { infinitive: 'a alimenta', en: 'to refuel', class: 'a-regular', provenance: 'verb-handbook' },
  { infinitive: 'a repara', en: 'to repair', class: 'a-regular', provenance: 'verb-handbook' },
  { infinitive: 'a schimba', en: 'to change', class: 'a-regular', provenance: 'verb-handbook' },
  { infinitive: 'a intra', en: 'to enter', class: 'a-regular', present: [['intru', 'I enter', 'IN-troo'], ['intri', 'you enter', 'IN-tree'], ['intră', 'he/she enters', 'IN-truh'], ['intrăm', 'we enter', 'IN-truhm'], ['intrați', 'you (pl.) enter', 'in-TRAHTS'], ['intră', 'they enter', 'IN-truh']], provenance: 'verb-handbook' },
  { infinitive: 'a ieși', en: 'to exit', class: 'e', present: [['ies', 'I exit', 'YES'], ['ieși', 'you exit', 'YEH-sh'], ['iese', 'he/she exits', 'YEH-seh'], ['ieșim', 'we exit', 'YEH-sheem'], ['ieșiți', 'you (pl.) exit', 'YEH-sheets'], ['ies', 'they exit', 'YES']], participle: 'ieșit', provenance: 'verb-handbook' },
  { infinitive: 'a aduce', en: 'to bring', class: 'e', present: [['aduc', 'I bring', 'ah-DOOK'], ['aduci', 'you bring', 'ah-DOOCH'], ['aduce', 'he/she brings', 'ah-DOO-cheh'], ['aducem', 'we bring', 'ah-DOO-chem'], ['aduceți', 'you (pl.) bring', 'ah-DOO-chets'], ['aduc', 'they bring', 'ah-DOOK']], participle: 'adus', provenance: 'verb-handbook' },
  { infinitive: 'a lua', en: 'to take', class: 'irregular', present: [['iau', 'I take', 'YOW'], ['iei', 'you take', 'YEH'], ['ia', 'he/she takes', 'YAH'], ['luăm', 'we take', 'LOO-uhm'], ['luați', 'you (pl.) take', 'LOO-ahts'], ['iau', 'they take', 'YOW']], participle: 'luat', imperfectStem: 'lua', provenance: 'verb-handbook' },
  { infinitive: 'a prefera', en: 'to prefer', class: 'a-regular', provenance: 'verb-handbook' },
  { infinitive: 'a gusta', en: 'to taste', class: 'a-regular', provenance: 'verb-handbook' },
  { infinitive: 'a veni', en: 'to come', class: 'i-esc', present: [['vin', 'I come', 'VEEN'], ['vii', 'you come', 'VEE'], ['vine', 'he/she comes', 'VEE-neh'], ['venim', 'we come', 'veh-NEEM'], ['veniți', 'you (pl.) come', 'veh-NEETS'], ['vin', 'they come', 'VEEN']], participle: 'venit', provenance: 'verb-handbook' },
  { infinitive: 'a sta', en: 'to stay / sit', class: 'a-regular', present: [['stau', 'I stay', 'STOW'], ['stai', 'you stay', 'STAY'], ['stă', 'he/she stays', 'STUH'], ['stăm', 'we stay', 'STUHM'], ['stați', 'you (pl.) stay', 'STAHTS'], ['stau', 'they stay', 'STOW']], provenance: 'verb-handbook' },
  { infinitive: 'a cunoaște', en: 'to know (someone)', class: 'e', present: [['cunosc', 'I know', 'koo-NOSK'], ['cunoști', 'you know', 'koo-NOSHT'], ['cunoaște', 'he/she knows', 'koo-NWAHSH-teh'], ['cunoaștem', 'we know', 'koo-NWAHSH-tem'], ['cunoașteți', 'you (pl.) know', 'koo-NWAHSH-tets'], ['cunosc', 'they know', 'koo-NOSK']], participle: 'cunoscut', provenance: 'verb-handbook' },
  { infinitive: 'a invita', en: 'to invite', class: 'a-regular', provenance: 'verb-handbook' },
  { infinitive: 'a lovi', en: 'to hit', class: 'i-esc', provenance: 'verb-handbook' },
];

export function slugVerbId(infinitive: string): string {
  return 'vb-' + infinitive.replace(/^a\s+/, '').replace(/\s+/g, '-').normalize('NFD').replace(/\p{M}/gu, '');
}
