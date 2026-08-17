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
  dictionaryStats,
  dictionaryAuditReport,
  platformGrammarAuditReport,
  buildDictionary,
  getCurrentWeeklyTopicId,
} from './buildDictionary';
export { auditEssentialGrammar } from './essentialGrammarValidation';
export type { EssentialGrammarAuditReport } from './essentialGrammarValidation';
