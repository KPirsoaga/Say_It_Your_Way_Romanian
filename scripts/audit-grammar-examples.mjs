#!/usr/bin/env node
/**
 * Audit Grammar Help example sentences (canonicalVerbBase + canonicalVerbTenses).
 * Run: npx tsx scripts/audit-grammar-examples.mjs
 */
import { canonicalVerbBase } from '../src/content/verbs/canonicalVerbBase.ts';
import { verbTenseSupplement } from '../src/content/verbs/canonicalVerbTenses.ts';
import { grammarVerbs } from '../src/content/verbs/canonicalVerbs.ts';

const examples = [];

for (const verb of canonicalVerbBase) {
  verb.examples?.forEach((ex, i) => {
    examples.push({ source: `canonicalVerbBase.ts:${verb.id}:present:${i}`, verbId: verb.id, ...ex });
  });
}

for (const [verbId, sup] of Object.entries(verbTenseSupplement)) {
  if (sup.examplesByTense) {
    for (const [tense, exs] of Object.entries(sup.examplesByTense)) {
      exs?.forEach((ex, i) => {
        examples.push({ source: `canonicalVerbTenses.ts:${verbId}:${tense}:${i}`, verbId, tense, ...ex });
      });
    }
  }
}

// Also collect merged verb examples from grammarVerbs (learner-facing)
for (const verb of grammarVerbs) {
  verb.examples?.forEach((ex, i) => {
    if (!examples.some((e) => e.ro === ex.ro && e.source.includes(verb.id))) {
      examples.push({ source: `grammarVerbs:${verb.id}:present:${i}`, verbId: verb.id, ...ex });
    }
  });
  if (verb.examplesByTense) {
    for (const [tense, exs] of Object.entries(verb.examplesByTense)) {
      exs?.forEach((ex, i) => {
        if (!examples.some((e) => e.ro === ex.ro)) {
          examples.push({ source: `grammarVerbs:${verb.id}:${tense}:${i}`, verbId: verb.id, tense, ...ex });
        }
      });
    }
  }
}

const failures = [];
const teacherReview = [];

// Known issues flagged during manual audit (must stay empty after corrections)
const KNOWN_ISSUES = [];

for (const ex of examples) {
  if (!ex.ro?.trim()) failures.push(`${ex.source}: empty ro`);
  if (!ex.en?.trim()) failures.push(`${ex.source}: empty en`);
  const known = KNOWN_ISSUES.find((k) => k.ro === ex.ro);
  if (known) failures.push(`${ex.source}: ${known.issue}`);
}

const flaggedVerbs = ['vb-pleca', 'vb-intreba', 'vb-manca', 'vb-bea'];
for (const v of flaggedVerbs) {
  const verb = canonicalVerbBase.find((x) => x.id === v);
  if (verb?.review?.needsReview) {
    verb.examples?.forEach((ex, i) => {
      teacherReview.push(`${v}:example:${i} — ${ex.ro} (pre-flagged needsReview)`);
    });
  }
}

console.log(`Grammar Help examples audited: ${examples.length}`);
console.log(`Teacher review items: ${teacherReview.length}`);
if (failures.length) {
  console.error('Issues found:');
  failures.forEach((f) => console.error(`  ✗ ${f}`));
  process.exit(1);
}
console.log('All grammar examples pass automated audit checks.');
if (teacherReview.length) {
  console.log('Pre-flagged for Teacher Review:');
  teacherReview.forEach((t) => console.log(`  · ${t}`));
}
