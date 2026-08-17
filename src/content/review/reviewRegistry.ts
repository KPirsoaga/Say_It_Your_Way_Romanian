import type { ReviewCatalogItem } from '../../types';

/** Standalone review items not tied to a single phrase line. */
export const supplementalReviewItems: ReviewCatalogItem[] = [
  {
    id: 'grammar-extended:parts-of-speech',
    contentArea: 'Grammar Help',
    contextLabel: 'Parts of speech · overview examples',
    ro: 'Mănânc pâine. / Am o cabană mică. / Sunt obosit.',
    en: 'Example sentences across verbs, nouns, and adjectives in Grammar Help.',
    reviewReason: 'New parts-of-speech examples were written for clarity — check natural Romanian with teacher.',
    suggestedBy: 'app author',
    teacherNotes: 'See src/content/grammarExtended.ts — gr-pos-verbs through gr-pos-predicative.',
  },
  {
    id: 'grammar-extended:indicative-imperfect',
    contentArea: 'Grammar Help',
    contextLabel: 'Indicative mood · imperfect overview',
    ro: 'Eu aveam o cabană mică. / Lucram în fiecare zi.',
    en: 'Imperfect overview examples in Grammar Help.',
    reviewReason: 'Imperfect tense examples should match how your teacher teaches habitual past.',
    suggestedBy: 'app author',
    teacherNotes: 'See gr-ind-imperfect in grammarExtended.ts.',
  },
];
