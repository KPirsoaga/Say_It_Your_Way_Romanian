export * from './types';
export * from './familyUtils';
export {
  dictionaryEntries,
  dictionaryPhrases,
  dictionaryFormAliases,
  getDictionaryEntry,
  getDictionaryPhrase,
  resolveDictionarySearch,
  searchDictionary,
  dictionaryLetterIndex,
  collectVariants,
  collectAllPracticeItems,
  dictionaryStats,
  dictionaryAuditReport,
  platformGrammarAuditReport,
  buildDictionary,
  getCurrentWeeklyTopicId,
} from './buildDictionary';
export { runLexicalRepairAudit, lexicalCoverageSummary } from './lexicalAudit';
export { verifiedNounFamilies, verifiedAdjectiveFamilies } from './verifiedLexicalFamilies';
export { auditEssentialGrammar } from './essentialGrammarValidation';
export type { EssentialGrammarAuditReport } from './essentialGrammarValidation';
