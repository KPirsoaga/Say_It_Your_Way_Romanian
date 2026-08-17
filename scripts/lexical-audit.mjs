#!/usr/bin/env node
/**
 * Post-repair lexical audit — run with: npx tsx scripts/lexical-audit.mjs
 */
import { runLexicalRepairAudit, lexicalCoverageSummary } from '../src/content/dictionary/lexicalAudit.ts';

const audit = runLexicalRepairAudit('post-repair');
console.log('=== LEXICAL REPAIR AUDIT (post-repair) ===\n');
console.log(JSON.stringify(audit, null, 2));
console.log('\n=== COVERAGE SUMMARY ===\n');
console.log(JSON.stringify(lexicalCoverageSummary(), null, 2));
