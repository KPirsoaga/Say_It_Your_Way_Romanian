import type { ValidationProvenance } from '../../types';

/** Provenance tiers safe to show learners as established Romanian facts */
export const LEARNER_SAFE_PROVENANCES: ReadonlySet<ValidationProvenance> = new Set([
  'lexical-explicit',
  'lexical-cross-checked',
  'teacher-validated',
]);

/**
 * Reference-explicit is learner-safe only when the individual form is listed
 * in the verified lexical registry (not merely inferred from grammar rules).
 */
export function isLearnerSafeProvenance(provenance: ValidationProvenance | undefined): boolean {
  if (!provenance) return false;
  return LEARNER_SAFE_PROVENANCES.has(provenance);
}

export function isPatternInferredProvenance(provenance: ValidationProvenance | undefined): boolean {
  return (
    provenance === 'pattern-inferred' ||
    provenance === 'reference-pattern-validated' ||
    provenance === 'verb-handbook' ||
    provenance === 'essential-grammar' ||
    provenance === 'unverified' ||
    provenance === 'partial'
  );
}

export interface LexicalSourceRef {
  url: string;
  dictionary: string;
  checkedAt: string;
}
