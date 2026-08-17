#!/usr/bin/env node
/**
 * Re-sanitize paradigm forms in dexonline-cache.json using improved parser cleaners.
 * Run: npx tsx scripts/sanitize-dexonline-cache.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cleanMergedForm } from './lib/dexonline-parser.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CACHE_PATH = join(ROOT, 'src/content/lexical/dexonline-cache.json');

function cleanForm(ro) {
  return cleanMergedForm(ro);
}

function cleanParadigm(paradigm) {
  if (!paradigm) return paradigm;
  const cleanRows = (rows) =>
    rows?.map((row) => ({
      ...row,
      ro: cleanForm(row.ro),
    }));
  return {
    ...paradigm,
    participiu: paradigm.participiu ? cleanForm(paradigm.participiu) : paradigm.participiu,
    present: cleanRows(paradigm.present),
    subjunctive: cleanRows(paradigm.subjunctive),
    imperfect: cleanRows(paradigm.imperfect),
  };
}

const cache = JSON.parse(readFileSync(CACHE_PATH, 'utf8'));
let cleaned = 0;

for (const [id, entry] of Object.entries(cache.verbs ?? {})) {
  if (!entry.paradigm) continue;
  const before = JSON.stringify(entry.paradigm);
  entry.paradigm = cleanParadigm(entry.paradigm);
  if (JSON.stringify(entry.paradigm) !== before) cleaned++;
}

for (const [id, entry] of Object.entries(cache.nouns ?? {})) {
  if (!entry.declension) continue;
  const d = entry.declension;
  const before = JSON.stringify(d);
  entry.declension = {
    ...d,
    singular: cleanForm(d.singular),
    plural: d.plural ? cleanForm(d.plural) : d.plural,
    definiteSingular: d.definiteSingular ? cleanForm(d.definiteSingular) : d.definiteSingular,
    definitePlural: d.definitePlural ? cleanForm(d.definitePlural) : d.definitePlural,
  };
  if (JSON.stringify(entry.declension) !== before) cleaned++;
}

writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2) + '\n');
console.log(`Sanitized dexonline cache (${cleaned} entries updated)`);
