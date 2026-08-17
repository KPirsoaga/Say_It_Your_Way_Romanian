import type { DictionaryAdjectiveFamily, DictionaryNounFamily } from './types';

/** Hand-authored noun/adjective families — uncertain forms flagged in build step */
export const curatedNounFamilies: Record<string, DictionaryNounFamily> = {
  câine: {
    gender: 'masculine',
    singular: { ro: 'câine', en: 'dog' },
    plural: { ro: 'câini', en: 'dogs' },
    definiteSingular: { ro: 'câinele', en: 'the dog' },
    definitePlural: { ro: 'câinii', en: 'the dogs' },
    articleNote: 'In Romanian, “the” is often attached to the end of the noun.',
  },
  cort: {
    gender: 'masculine',
    singular: { ro: 'cort', en: 'tent' },
    plural: { ro: 'corturi', en: 'tents' },
    definiteSingular: { ro: 'cortul', en: 'the tent' },
    definitePlural: { ro: 'corturile', en: 'the tents' },
    articleNote: 'In Romanian, “the” is often attached to the end of the noun.',
  },
  acoperiș: {
    gender: 'masculine',
    singular: { ro: 'acoperiș', en: 'roof' },
    plural: { ro: 'acoperișuri', en: 'roofs' },
    definiteSingular: { ro: 'acoperișul', en: 'the roof' },
    definitePlural: { ro: 'acoperișurile', en: 'the roofs' },
  },
  pod: {
    gender: 'neuter',
    singular: { ro: 'pod', en: 'attic / bridge' },
    plural: { ro: 'poduri', en: 'attics / bridges' },
    definiteSingular: { ro: 'podul', en: 'the attic / the bridge' },
    definitePlural: { ro: 'podurile', en: 'the attics / the bridges' },
    articleNote: 'Context matters — in the cabin topic, pod means attic.',
  },
  pâine: {
    gender: 'feminine',
    singular: { ro: 'pâine', en: 'bread' },
    plural: { ro: 'pâini', en: 'loaves of bread' },
    definiteSingular: { ro: 'pâinea', en: 'the bread' },
    definitePlural: { ro: 'pâinile', en: 'the breads' },
  },
  mașină: {
    gender: 'feminine',
    singular: { ro: 'mașină', en: 'car' },
    plural: { ro: 'mașini', en: 'cars' },
    definiteSingular: { ro: 'mașina', en: 'the car' },
    definitePlural: { ro: 'mașinile', en: 'the cars' },
  },
  grătar: {
    gender: 'masculine',
    singular: { ro: 'grătar', en: 'barbecue / grill' },
    plural: { ro: 'grătare', en: 'barbecues / grills' },
    definiteSingular: { ro: 'grătarul', en: 'the barbecue' },
    definitePlural: { ro: 'grătarele', en: 'the barbecues' },
  },
  râu: {
    gender: 'masculine',
    singular: { ro: 'râu', en: 'river' },
    plural: { ro: 'râuri', en: 'rivers' },
    definiteSingular: { ro: 'râul', en: 'the river' },
    definitePlural: { ro: 'râurile', en: 'the rivers' },
  },
  pădure: {
    gender: 'feminine',
    singular: { ro: 'pădure', en: 'forest' },
    plural: { ro: 'păduri', en: 'forests' },
    definiteSingular: { ro: 'pădurea', en: 'the forest' },
    definitePlural: { ro: 'pădurile', en: 'the forests' },
  },
};

export const curatedAdjectiveFamilies: Record<string, DictionaryAdjectiveFamily> = {
  bun: {
    masculineSingular: { ro: 'bun', en: 'good' },
    feminineSingular: { ro: 'bună', en: 'good' },
    masculinePlural: { ro: 'buni', en: 'good' },
    femininePlural: { ro: 'bune', en: 'good' },
  },
  mare: {
    masculineSingular: { ro: 'mare', en: 'big / large' },
    feminineSingular: { ro: 'mare', en: 'big / large' },
    masculinePlural: { ro: 'mari', en: 'big / large' },
    femininePlural: { ro: 'mari', en: 'big / large' },
  },
  mic: {
    masculineSingular: { ro: 'mic', en: 'small' },
    feminineSingular: { ro: 'mică', en: 'small' },
    masculinePlural: { ro: 'mici', en: 'small' },
    femininePlural: { ro: 'mici', en: 'small' },
  },
  greu: {
    masculineSingular: { ro: 'greu', en: 'heavy' },
    feminineSingular: { ro: 'grea', en: 'heavy' },
    masculinePlural: { ro: 'grei', en: 'heavy' },
    femininePlural: { ro: 'grele', en: 'heavy' },
  },
};
