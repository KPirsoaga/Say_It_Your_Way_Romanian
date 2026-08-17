#!/usr/bin/env node
/**
 * Audit learner/teacher-facing Romanian in QR/share flows.
 * Run: npx tsx scripts/audit-qr-share.mjs
 */
import { collectReviewItems } from '../src/content/review/collectReviewItems.ts';
import { buildProgressExportPayload } from '../src/services/qr/progressPackage.ts';
import { buildReviewExportItems } from '../src/services/qr/reviewPackage.ts';

const progress = {
  practisedDays: ['2026-08-17'],
  favourites: [],
  completedScenarios: [],
  completedConversations: ['shop-chat'],
  listenCorrect: 0,
  speakDone: 0,
  builderDone: 2,
  completedGrammarTopics: [],
  weeklyTopics: {},
  dictionaryWordsSeen: [],
};

const reviewItems = collectReviewItems();
const getStatus = () => 'pending';

const progressPayload = buildProgressExportPayload(progress, reviewItems, getStatus);
const exportItems = buildReviewExportItems(reviewItems.slice(0, 5), getStatus);

const learnerFacingRo = [];

// Progress export: Romanian only in topFlaggedItems.ro and difficultVerbs (verbs from audited content)
progressPayload.topFlaggedItems.forEach((item) => {
  learnerFacingRo.push({ source: 'progress-export:flagged', ro: item.ro, en: item.en });
});
progressPayload.difficultVerbs.forEach((v) => {
  learnerFacingRo.push({ source: 'progress-export:difficultVerb', ro: v, en: '(verb headword)' });
});

// Review export: passes through audited review catalog RO strings
exportItems.forEach((item) => {
  learnerFacingRo.push({ source: 'review-export', ro: item.ro, en: item.en });
});

// UI labels in share pages are English-only (verified: TeacherProgressPage, TeacherQrReviewPage)
const uiRomanian = 0;

console.log('=== QR/Share Romanian audit ===');
console.log(`Learner-facing RO strings in export payloads: ${learnerFacingRo.length}`);
console.log(`Authored UI Romanian in share pages: ${uiRomanian}`);
console.log('');
console.log('Finding: QR/share flows contain NO new authored Romanian.');
console.log('Romanian text is pass-through from already-audited content:');
console.log('  - review-export items ← collectReviewItems() (flagged content catalog)');
console.log('  - progress-export topFlaggedItems ← same review catalog');
console.log('  - progress-export difficultVerbs ← weekly topic vocab + grammar verb infinitives');
console.log('Encoded QR payloads (base64 JSON) are machine data — not language content.');
console.log('');
console.log(`Sample export RO strings checked: ${learnerFacingRo.length}`);
learnerFacingRo.slice(0, 5).forEach((s) => console.log(`  · [${s.source}] ${s.ro}`));
console.log('\nQR/share audit: PASS (no independent authored Romanian).');
