import type { ValidationProvenance } from '../../types';
import type { LexicalSafetyTier } from '../lexical/canonical/types';

/** Provenance tiers safe to show learners as established Romanian facts */
export const LEARNER_SAFE_PROVENANCES: ReadonlySet<ValidationProvenance> = new Set([
  'lexical-explicit',
  'lexical-cross-checked',
  'teacher-validated',
]);

export const LEARNER_SAFE_TIERS: ReadonlySet<LexicalSafetyTier> = new Set([
  'lexical-attested',
  'lexical-composed',
  'teacher-validated',
]);

export function isLearnerSafeTier(tier: LexicalSafetyTier | undefined): boolean {
  if (!tier) return false;
  return LEARNER_SAFE_TIERS.has(tier);
}

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

export function safetyTierLabel(tier: LexicalSafetyTier): string {
  switch (tier) {
    case 'lexical-attested':
      return 'Verified on dexonline';
    case 'lexical-composed':
      return 'Built from verified parts';
    case 'teacher-validated':
      return 'Teacher validated';
    default:
      return 'Unresolved';
  }
}
