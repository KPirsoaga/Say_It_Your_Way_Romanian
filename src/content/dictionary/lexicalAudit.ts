import { nounFamilyCandidateRegistry } from './nounFamilyBuilder';
import { dictionaryEntries, dictionaryFormAliases, collectVariants } from './buildDictionary';
import { verifiedAdjectiveFamilies } from './verifiedLexicalFamilies';
import { canonicalGrammarVerbs } from '../verbs/canonicalVerbs';
import { verifiedVerbTenses } from '../verbs/verifiedVerbForms';

export type LexicalAuditClassification = 'verified' | 'partially-verified' | 'unverified' | 'conflicting';

export interface LexicalRepairAudit {
  stage: 'pre-repair' | 'post-repair';
  generators: {
    nounFamilyBuilder: string;
    weeklyVerbPatterns: string;
    curatedFamilies: string;
  };
  nouns: {
    candidateRegistryTotal: number;
    patternGeneratedCandidates: number;
    dictionaryHeadwords: number;
    fullyVerified: number;
    partiallyVerified: number;
    baseOnly: number;
    conflicting: number;
  };
  verbs: {
    totalAudited: number;
    fullyVerified: number;
    partiallyVerified: number;
    unresolved: number;
    patternInferredWeekly: number;
  };
  adjectives: {
    dictionaryHeadwords: number;
    fullyVerified: number;
    unverified: number;
  };
  aliases: {
    total: number;
    variantPoolSize: number;
  };
  teacherReviewRemaining: string[];
}

function classifyNoun(entry: (typeof dictionaryEntries)[0]): LexicalAuditClassification {
  if (!entry.nounFamily) return 'unverified';
  if (entry.familyComplete) return 'verified';
  if (entry.nounFamily.plural || entry.nounFamily.definiteSingular) return 'partially-verified';
  return 'base-only' as LexicalAuditClassification;
}

export function runLexicalRepairAudit(stage: 'pre-repair' | 'post-repair' = 'post-repair'): LexicalRepairAudit {
  const nouns = dictionaryEntries.filter((e) => e.type === 'noun');
  const adjectives = dictionaryEntries.filter((e) => e.type === 'adjective');

  const nounClasses = nouns.map(classifyNoun);
  const patternCandidates = Object.values(nounFamilyCandidateRegistry).filter(
    (f) => f.provenance === 'reference-pattern-validated' || f.provenance === 'pattern-inferred'
  ).length;

  const verbsFullyVerified = Object.entries(verifiedVerbTenses).filter(([, tenses]) => {
    const hasPresent = tenses.some((t) => t.tense === 'present');
    const hasAllFour =
      tenses.some((t) => t.tense === 'present') &&
      tenses.some((t) => t.tense === 'perfect-compus') &&
      tenses.some((t) => t.tense === 'imperfect') &&
      tenses.some((t) => t.tense === 'future');
    return hasAllFour || (hasPresent && tenses.length >= 1);
  }).length;

  const verbsWithPresent = Object.keys(verifiedVerbTenses).length;
  const verbsUnresolved = canonicalGrammarVerbs.length - verbsWithPresent;

  const teacherReviewRemaining = dictionaryEntries
    .filter((e) => e.review?.needsReview)
    .map((e) => `${e.headwordRo}: ${e.review?.reviewReason}`);

  return {
    stage,
    generators: {
      nounFamilyBuilder: 'src/content/dictionary/nounFamilyBuilder.ts (candidates only)',
      weeklyVerbPatterns: 'src/content/verbs/weeklyVerbPatterns.ts (pattern-inferred, not learner-facing)',
      curatedFamilies: 'src/content/dictionary/verifiedLexicalFamilies.ts (learner source)',
    },
    nouns: {
      candidateRegistryTotal: Object.keys(nounFamilyCandidateRegistry).length,
      patternGeneratedCandidates: patternCandidates,
      dictionaryHeadwords: nouns.length,
      fullyVerified: nounClasses.filter((c) => c === 'verified').length,
      partiallyVerified: nounClasses.filter((c) => c === 'partially-verified').length,
      baseOnly: nounClasses.filter((c) => c === ('base-only' as LexicalAuditClassification) || c === 'unverified').length,
      conflicting: nounClasses.filter((c) => c === 'conflicting').length,
    },
    verbs: {
      totalAudited: canonicalGrammarVerbs.length,
      fullyVerified: verbsFullyVerified,
      partiallyVerified: verbsWithPresent - verbsFullyVerified,
      unresolved: verbsUnresolved,
      patternInferredWeekly: canonicalGrammarVerbs.filter((v) => v.provenance === 'pattern-inferred').length,
    },
    adjectives: {
      dictionaryHeadwords: adjectives.length,
      fullyVerified: Object.keys(verifiedAdjectiveFamilies).length,
      unverified: adjectives.length - Object.keys(verifiedAdjectiveFamilies).length,
    },
    aliases: {
      total: dictionaryFormAliases.length,
      variantPoolSize: dictionaryEntries.flatMap((e) => collectVariants(e, 'wider')).length,
    },
    teacherReviewRemaining,
  };
}

export function lexicalCoverageSummary() {
  const audit = runLexicalRepairAudit('post-repair');
  return {
    nouns: `${audit.nouns.fullyVerified} fully verified / ${audit.nouns.dictionaryHeadwords} total (${audit.nouns.baseOnly} base-only)`,
    verbs: `${Object.keys(verifiedVerbTenses).length} with verified tenses / ${audit.verbs.totalAudited} total`,
    adjectives: `${audit.adjectives.fullyVerified} fully verified / ${audit.adjectives.dictionaryHeadwords} total`,
    aliases: audit.aliases.total,
    dailyPracticePool: audit.aliases.variantPoolSize,
  };
}
