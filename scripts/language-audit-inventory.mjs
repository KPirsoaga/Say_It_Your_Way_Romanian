#!/usr/bin/env node
/** Inventory learner-facing Romanian strings for LANGUAGE-AUDIT.md */
import { weeklyTopics } from '../src/content/weeklyTopics/index.ts';
import {
  phraseBuilderItems,
  listenChooseItems,
  realLifeCategories,
  survivalPhrases,
  miniConversations,
  scenarios,
} from '../src/content.ts';
import {
  extraPhraseBuilderItems,
  extraListenChooseItems,
  extraRealLifeCategories,
  extraSurvivalPhrases,
  extraMiniConversations,
  extraScenarios,
} from '../src/content/additions.ts';
import { cabinPhraseBuilderItems } from '../src/content/weeklyTopics/cabinPhraseBuilder.ts';
import {
  grammarCheatSheets,
  grammarTenseGuides,
  grammarSentencePatterns,
  grammarPartsOfSpeech,
} from '../src/content/grammar.ts';
import { extendedGrammarTopics } from '../src/content/grammarExtended.ts';

function countTopic(t) {
  const v = t.vocabulary.length;
  const readings = t.readings.length;
  const roWords = t.readings.reduce((n, r) => n + r.newWords.length, 0);
  const roToEn = t.exercises.roToEn.length;
  const enToRo = t.exercises.enToRo.length;
  const matching = t.exercises.matching.length;
  const sorting = t.exercises.sortItems.length;
  const phrases = t.vocabulary.filter((x) => x.category === 'phrase').length;
  return {
    vocab: v,
    phrases,
    readings,
    newWords: roWords,
    roToEn,
    enToRo,
    matching,
    sorting,
    total:
      v +
      readings * 2 +
      roWords +
      roToEn * 5 +
      enToRo * 5 +
      matching * 2 +
      sorting * 2,
  };
}

const topics = weeklyTopics.map((t) => ({ title: t.title, ...countTopic(t) }));

const allPhraseBuilder = [...phraseBuilderItems, ...extraPhraseBuilderItems, ...cabinPhraseBuilderItems];
const allListen = [...listenChooseItems, ...extraListenChooseItems];
const allRealLife = [...realLifeCategories, ...extraRealLifeCategories];
const allSurvival = [...survivalPhrases, ...extraSurvivalPhrases];
const allMini = [...miniConversations, ...extraMiniConversations];
const allScenarios = [...scenarios, ...extraScenarios];

const grammarExamples =
  extendedGrammarTopics.reduce((n, s) => n + (s.examples?.length ?? 0), 0) +
  grammarTenseGuides.reduce((n, g) => n + (g.examples?.length ?? 0), 0) +
  grammarPartsOfSpeech.reduce((n, p) => n + (p.examples?.length ?? 0), 0) +
  grammarSentencePatterns.reduce((n, p) => n + (p.examples?.length ?? 0), 0);

console.log(JSON.stringify({
  weeklyTopics: topics,
  phraseBuilder: { items: allPhraseBuilder.length, chunks: allPhraseBuilder.reduce((n, i) => n + i.chunks.length, 0) },
  listenChoose: { items: allListen.length },
  realLife: { categories: allRealLife.length, phrases: allRealLife.reduce((n, c) => n + c.phrases.length, 0) },
  survival: { phrases: allSurvival.length },
  miniConversations: { conversations: allMini.length, lines: allMini.reduce((n, c) => n + c.lines.length, 0) },
  scenarios: { scenarios: allScenarios.length, lines: allScenarios.reduce((n, s) => n + s.lines.length, 0) },
  grammar: {
    cheatSheets: grammarCheatSheets.length,
    tenseGuides: grammarTenseGuides.length,
    partsOfSpeech: grammarPartsOfSpeech.length,
    sentencePatterns: grammarSentencePatterns.length,
    extendedSections: grammarExtended.length,
    exampleSentences: grammarExamples,
  },
}, null, 2));
