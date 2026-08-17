#!/usr/bin/env node
/**
 * Fetch dexonline.ro paradigms and regenerate verified learner lexical files.
 *
 * Usage:
 *   npx tsx scripts/import-dexonline-lexical.mjs           # fetch + generate
 *   npx tsx scripts/import-dexonline-lexical.mjs --dry-run
 *   npx tsx scripts/import-dexonline-lexical.mjs --verbs-only
 *   npx tsx scripts/import-dexonline-lexical.mjs --nouns-only
 */
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parseVerbParadigm,
  parseNounDeclension,
  lemmaFromInfinitive,
} from './lib/dexonline-parser.mjs';
import { canonicalGrammarVerbs } from '../src/content/verbs/canonicalVerbs.ts';
import { canonicalVerbBase } from '../src/content/verbs/canonicalVerbBase.ts';
import { verbTenseSupplement } from '../src/content/verbs/canonicalVerbTenses.ts';
import { nounFamilyCandidateRegistry } from '../src/content/dictionary/nounFamilyBuilder.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CACHE_PATH = join(ROOT, 'src/content/lexical/dexonline-cache.json');
const VERIFIED_VERBS_PATH = join(ROOT, 'src/content/verbs/verifiedVerbForms.ts');
const VERIFIED_NOUNS_PATH = join(ROOT, 'src/content/dictionary/verifiedLexicalFamilies.ts');

const DEX = 'DEX / DOOM via dexonline.ro';
const CHECKED = '2026-08-17';
const LABELS = ['eu', 'tu', 'el/ea', 'noi', 'voi', 'ei/ele'];
const EN_WHO = { eu: 'I', tu: 'you', 'el/ea': 'he/she', noi: 'we', voi: 'you (pl.)', 'ei/ele': 'they' };

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const verbsOnly = args.has('--verbs-only');
const nounsOnly = args.has('--nouns-only');

function dexUrl(word) {
  return `https://dexonline.ro/definitie/${encodeURIComponent(word)}`;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchPage(lemma) {
  const url = dexUrl(lemma);
  const res = await fetch(url, {
    headers: { 'User-Agent': 'SayItYourWayRomanian-LexicalImport/1.0 (educational; dexonline.ro)' },
  });
  if (!res.ok) return { url, html: null, status: res.status };
  const html = await res.text();
  return { url, html, status: res.status };
}

function loadCache() {
  if (!existsSync(CACHE_PATH)) {
    return { fetchedAt: null, verbs: {}, nouns: {}, errors: {} };
  }
  return JSON.parse(readFileSync(CACHE_PATH, 'utf8'));
}

function saveCache(cache) {
  cache.fetchedAt = new Date().toISOString().slice(0, 10);
  if (!dryRun) {
    mkdirSync(dirname(CACHE_PATH), { recursive: true });
    writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2) + '\n');
  }
}

/** Build lookup of existing English/pron by verb id + label + tense */
function buildMetadataIndex() {
  const byId = {};

  for (const verb of canonicalGrammarVerbs) {
    byId[verb.id] = { infinitive: verb.infinitive, en: verb.en, tenses: {} };
    const addForms = (tense, forms) => {
      if (!forms?.length) return;
      byId[verb.id].tenses[tense] = Object.fromEntries(forms.map((f) => [f.label, f]));
    };
    addForms('present', verb.present);
    addForms('imperfect', verb.imperfect);
    addForms('perfect-compus', verb.perfectCompus);
    addForms('future', verb.future);

    const sup = verbTenseSupplement[verb.id];
    if (sup) {
      addForms('imperfect', sup.imperfect);
      addForms('perfect-compus', sup.perfectCompus);
      addForms('future', sup.future);
    }
  }

  for (const verb of canonicalVerbBase) {
    if (!byId[verb.id]) byId[verb.id] = { infinitive: verb.infinitive, en: verb.en, tenses: {} };
    const addForms = (tense, forms) => {
      if (!forms?.length) return;
      byId[verb.id].tenses[tense] = {
        ...(byId[verb.id].tenses[tense] ?? {}),
        ...Object.fromEntries(forms.map((f) => [f.label, f])),
      };
    };
    addForms('present', verb.present);
    addForms('imperfect', verb.imperfect);
  }

  return byId;
}

function enFor(label, enBase, ro, tense) {
  const who = EN_WHO[label] ?? label;
  const base = enBase.replace(/^to\s+/, '');
  if (tense === 'perfect-compus') return `${who} ${base} (past)`;
  if (tense === 'imperfect') return `${who} ${base} (ongoing / used to)`;
  if (tense === 'future') return `${who} will ${base}`;
  return `${who} ${base}`.trim();
}

function makeVerbForm(label, ro, meta, tense) {
  const existing = meta?.tenses?.[tense]?.[label];
  const enBase = meta?.en ?? '...';
  return {
    label,
    ro,
    en: existing?.en ?? enFor(label, enBase, ro, tense),
    pron: existing?.pron ?? ro,
  };
}

function buildPerfectCompus(participiu, meta) {
  const aux = [
    ['am', 'eu'],
    ['ai', 'tu'],
    ['a', 'el/ea'],
    ['am', 'noi'],
    ['ați', 'voi'],
    ['au', 'ei/ele'],
  ];
  return aux.map(([a, label]) => {
    const ro = `${a} ${participiu}`;
    const existing = meta?.tenses?.['perfect-compus']?.[label];
    return {
      label,
      ro,
      en: existing?.en ?? enFor(label, meta.en, ro, 'perfect-compus'),
      pron: existing?.pron ?? ro,
    };
  });
}

function buildFuture(subjunctive, meta, reflexive = false) {
  const cliticPrefix = ['mă', 'te', 'se', 'ne', 'vă', 'se'];
  return subjunctive
    .filter((s) => s.ro)
    .map(({ label, ro }, i) => {
      const idx = LABELS.indexOf(label);
      const roForm =
        reflexive && meta?.tenses?.present?.[label]?.ro
          ? `o să ${cliticPrefix[idx]} ${ro}`
          : `o să ${ro}`;
      const existing = meta?.tenses?.future?.[label];
      return {
        label,
        ro: roForm,
        en: existing?.en ?? enFor(label, meta.en, roForm, 'future'),
        pron: existing?.pron ?? roForm,
      };
    });
}

function buildVerifiedVerbEntry(verbId, paradigm, meta, url, verb) {
  const tenses = [];
  const source = { url, dictionary: DEX, checkedAt: CHECKED };
  const reflexive = verb?.infinitive?.startsWith('a se ');

  if (paradigm.present.every((p) => p.ro)) {
    tenses.push({
      tense: 'present',
      forms: paradigm.present.map(({ label, ro }) => makeVerbForm(label, ro, meta, 'present')),
      provenance: reflexive ? 'lexical-cross-checked' : 'lexical-explicit',
      sources: [source],
    });
  }

  if (paradigm.imperfect.every((p) => p.ro)) {
    tenses.push({
      tense: 'imperfect',
      forms: paradigm.imperfect.map(({ label, ro }) => makeVerbForm(label, ro, meta, 'imperfect')),
      provenance: reflexive ? 'lexical-cross-checked' : 'lexical-explicit',
      sources: [source],
    });
  }

  if (paradigm.participiu) {
    tenses.push({
      tense: 'perfect-compus',
      forms: buildPerfectCompus(paradigm.participiu, meta),
      provenance: 'lexical-explicit',
      sources: [source],
    });
  }

  if (paradigm.subjunctive.every((p) => p.ro)) {
    tenses.push({
      tense: 'future',
      forms: buildFuture(paradigm.subjunctive, meta, reflexive),
      provenance: 'lexical-cross-checked',
      sources: [source],
    });
  }

  return tenses;
}

/** Reflexive verbs: prefix dexonline stems with clitic pronouns */
function applyReflexiveOverrides(verb, paradigm, meta) {
  if (!verb.infinitive.startsWith('a se ')) return paradigm;

  const cliticPrefix = ['mă', 'te', 'se', 'ne', 'vă', 'se'];

  const withClitic = (stem, i) => {
    const existing =
      meta?.tenses?.present?.[LABELS[i]]?.ro ??
      meta?.tenses?.imperfect?.[LABELS[i]]?.ro ??
      '';
    if (existing && (existing.endsWith(stem) || existing.includes(` ${stem}`))) {
      return existing.replace(/^să\s+/, '');
    }
    return `${cliticPrefix[i]} ${stem}`;
  };

  const stemsMatch = paradigm.present.every((p, i) => {
    const ex = meta?.tenses?.present?.[LABELS[i]]?.ro ?? '';
    return !ex || ex.endsWith(p.ro) || ex.includes(p.ro);
  });

  if (!stemsMatch) return paradigm;

  return {
    ...paradigm,
    present: LABELS.map((label, i) => ({
      label,
      ro: withClitic(paradigm.present[i].ro, i),
    })),
    subjunctive: LABELS.map((label, i) => ({
      label,
      ro: paradigm.subjunctive[i]?.ro ?? '',
    })),
    imperfect: LABELS.map((label, i) => ({
      label,
      ro: meta?.tenses?.imperfect?.[label]?.ro ?? withClitic(paradigm.imperfect[i]?.ro ?? '', i),
    })),
  };
}

function escapeStr(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function emitVerbFormsTs(verified) {
  const lines = [];
  lines.push(`import type { GrammarTense, VerbForm } from '../../types';`);
  lines.push(`import type { LexicalSourceRef } from '../validation/lexicalSafety';`);
  lines.push('');
  lines.push(`export interface VerifiedVerbTense {`);
  lines.push(`  tense: GrammarTense;`);
  lines.push(`  forms: VerbForm[];`);
  lines.push(`  provenance: 'lexical-explicit' | 'lexical-cross-checked' | 'teacher-validated';`);
  lines.push(`  sources: LexicalSourceRef[];`);
  lines.push(`}`);
  lines.push('');
  lines.push(`const DEX = '${DEX}';`);
  lines.push(`const CHECKED = '${CHECKED}';`);
  lines.push('');
  lines.push(`const LABELS = ['eu', 'tu', 'el/ea', 'noi', 'voi', 'ei/ele'] as const;`);
  lines.push('');
  lines.push(`function vf(rows: [string, string, string][]): VerbForm[] {`);
  lines.push(`  return rows.map(([ro, en, pron], i) => ({`);
  lines.push(`    label: LABELS[i] ?? \`p\${i}\`,`);
  lines.push(`    ro,`);
  lines.push(`    en,`);
  lines.push(`    pron: pron || ro,`);
  lines.push(`  }));`);
  lines.push(`}`);
  lines.push('');
  lines.push(`/**`);
  lines.push(` * Verb tenses verified individually on dexonline.ro.`);
  lines.push(` * Generated by scripts/import-dexonline-lexical.mjs — do not hand-edit rows.`);
  lines.push(` * Unlisted verb IDs must not expose conjugation tables to learners.`);
  lines.push(` */`);
  lines.push(`export const verifiedVerbTenses: Record<string, VerifiedVerbTense[]> = {`);

  const sortedIds = Object.keys(verified).sort();
  for (const id of sortedIds) {
    const tenses = verified[id];
    lines.push(`  '${id}': [`);
    for (const t of tenses) {
      lines.push(`    {`);
      lines.push(`      tense: '${t.tense}',`);
      lines.push(`      forms: vf([`);
      for (const f of t.forms) {
        lines.push(`        ['${escapeStr(f.ro)}', '${escapeStr(f.en)}', '${escapeStr(f.pron)}'],`);
      }
      lines.push(`      ]),`);
      lines.push(`      provenance: '${t.provenance}',`);
      const src = t.sources[0];
      lines.push(`      sources: [{ url: '${src.url}', dictionary: DEX, checkedAt: CHECKED }],`);
      lines.push(`    },`);
    }
    lines.push(`  ],`);
  }

  lines.push(`};`);
  lines.push('');
  lines.push(`export function getVerifiedTensesForVerb(verbId: string): VerifiedVerbTense[] {`);
  lines.push(`  return verifiedVerbTenses[verbId] ?? [];`);
  lines.push(`}`);
  lines.push('');
  lines.push(`export function isVerbTenseLearnerSafe(verbId: string, tense: GrammarTense): boolean {`);
  lines.push(`  return getVerifiedTensesForVerb(verbId).some((v) => v.tense === tense);`);
  lines.push(`}`);
  lines.push('');
  lines.push(`export function getLearnerSafeVerbForms(verbId: string, tense: GrammarTense): VerbForm[] | undefined {`);
  lines.push(`  const match = getVerifiedTensesForVerb(verbId).find((v) => v.tense === tense);`);
  lines.push(`  return match?.forms;`);
  lines.push(`}`);
  lines.push('');

  return lines.join('\n');
}

function emitNounFamiliesTs(existingAdjectives, newNouns) {
  const adjectiveBlock = readFileSync(VERIFIED_NOUNS_PATH, 'utf8').match(
    /\/\*\* Adjective families[\s\S]*$/
  )?.[0];

  if (!adjectiveBlock) throw new Error('Could not find adjective section in verifiedLexicalFamilies.ts');

  const lines = [];
  lines.push(`import type { DictionaryAdjectiveFamily, DictionaryNounFamily } from './types';`);
  lines.push(`import type { LexicalSourceRef } from '../validation/lexicalSafety';`);
  lines.push('');
  lines.push(`export interface VerifiedNounEntry {`);
  lines.push(`  family: DictionaryNounFamily;`);
  lines.push(`  complete: boolean;`);
  lines.push(`  provenance: 'lexical-explicit' | 'lexical-cross-checked';`);
  lines.push(`  sources: LexicalSourceRef[];`);
  lines.push(`  verifiedForms: ('singular' | 'plural' | 'definiteSingular' | 'definitePlural')[];`);
  lines.push(`}`);
  lines.push('');
  lines.push(`export interface VerifiedAdjectiveEntry {`);
  lines.push(`  family: DictionaryAdjectiveFamily;`);
  lines.push(`  complete: boolean;`);
  lines.push(`  provenance: 'lexical-explicit' | 'lexical-cross-checked';`);
  lines.push(`  sources: LexicalSourceRef[];`);
  lines.push(`  verifiedForms: ('masculineSingular' | 'feminineSingular' | 'masculinePlural' | 'femininePlural')[];`);
  lines.push(`}`);
  lines.push('');
  lines.push(`const DEX = '${DEX}';`);
  lines.push(`const CHECKED = '${CHECKED}';`);
  lines.push('');
  lines.push(`function dexUrl(word: string): string {`);
  lines.push(`  return \`https://dexonline.ro/definitie/\${encodeURIComponent(word)}\`;`);
  lines.push(`}`);
  lines.push('');
  lines.push(`/**`);
  lines.push(` * Noun families verified individually on dexonline.ro (not pattern-derived).`);
  lines.push(` * Generated by scripts/import-dexonline-lexical.mjs — do not hand-edit rows.`);
  lines.push(` */`);
  lines.push(`export const verifiedNounFamilies: Record<string, VerifiedNounEntry> = {`);

  const sortedKeys = Object.keys(newNouns).sort((a, b) => a.localeCompare(b, 'ro'));
  for (const key of sortedKeys) {
    const { decl, spec } = newNouns[key];
    const verifiedForms = ['singular'];
    if (decl.plural) verifiedForms.push('plural');
    if (decl.definiteSingular) verifiedForms.push('definiteSingular');
    if (decl.definitePlural) verifiedForms.push('definitePlural');
    const complete = verifiedForms.length === 4;

    lines.push(`  ${JSON.stringify(key)}: {`);
    lines.push(`    family: {`);
    lines.push(`      gender: '${decl.gender}',`);
    lines.push(`      singular: { ro: '${escapeStr(decl.singular)}', en: '${escapeStr(spec.en)}' },`);
    if (decl.plural) {
      lines.push(`      plural: { ro: '${escapeStr(decl.plural)}', en: '${escapeStr(spec.pluralEn ?? spec.en + 's')}' },`);
    }
    if (decl.definiteSingular) {
      lines.push(
        `      definiteSingular: { ro: '${escapeStr(decl.definiteSingular)}', en: 'the ${escapeStr(spec.en)}' },`
      );
    }
    if (decl.definitePlural) {
      lines.push(
        `      definitePlural: { ro: '${escapeStr(decl.definitePlural)}', en: 'the ${escapeStr(spec.pluralEn ?? spec.en + 's')}' },`
      );
    }
    if (spec.articleNote) {
      lines.push(`      articleNote: '${escapeStr(spec.articleNote)}',`);
    }
    lines.push(`      complete: ${complete},`);
    lines.push(`    },`);
    lines.push(`    complete: ${complete},`);
    lines.push(`    provenance: 'lexical-explicit',`);
    lines.push(`    sources: [{ url: dexUrl('${escapeStr(key)}'), dictionary: DEX, checkedAt: CHECKED }],`);
    lines.push(`    verifiedForms: [${verifiedForms.map((f) => `'${f}'`).join(', ')}],`);
    lines.push(`  },`);
  }

  lines.push(`};`);
  lines.push('');
  lines.push(adjectiveBlock.trimStart());

  return lines.join('\n');
}

async function fetchVerbs(cache, meta) {
  if (!cache.verbs) cache.verbs = {};
  const verified = {};
  const skip = new Set(['vb-nevoie']); // compound — handled separately

  for (const verb of canonicalGrammarVerbs) {
    if (skip.has(verb.id)) continue;
    const lemma = lemmaFromInfinitive(verb.infinitive);
    if (!lemma) {
      console.log(`  skip ${verb.id}: multi-word infinitive`);
      continue;
    }

    let entry = cache.verbs[verb.id];
    if (!entry?.paradigm) {
      process.stdout.write(`  fetch ${verb.id} (${lemma})... `);
      const { url, html, status } = await fetchPage(lemma);
      await sleep(350);
      if (!html) {
        console.log(`FAIL ${status}`);
        cache.errors[verb.id] = `HTTP ${status}`;
        continue;
      }
      const paradigm = parseVerbParadigm(html);
      if (!paradigm) {
        console.log('no paradigm');
        cache.errors[verb.id] = 'no paradigm parsed';
        continue;
      }
      entry = { url, lemma, paradigm };
      cache.verbs[verb.id] = entry;
      console.log('ok');
    } else {
      console.log(`  cached ${verb.id}`);
    }

    let paradigm = entry.paradigm;
    paradigm = applyReflexiveOverrides(verb, paradigm, meta[verb.id]);
    const tenses = buildVerifiedVerbEntry(verb.id, paradigm, meta[verb.id], entry.url, verb);
    if (tenses.length) verified[verb.id] = tenses;
  }

  // Compound: a avea nevoie de — cross-check present/imperfect from avea + fixed phrase
  const nevoieMeta = meta['vb-nevoie'];
  if (nevoieMeta && verified['vb-avea']) {
    const aveaImp = verified['vb-avea'].find((t) => t.tense === 'imperfect')?.forms ?? [];
    const suffix = ' nevoie de';
    const tenses = [];

    if (nevoieMeta.tenses.present) {
      tenses.push({
        tense: 'present',
        forms: LABELS.map((label) => {
          const ex = nevoieMeta.tenses.present[label];
          return makeVerbForm(label, ex.ro, nevoieMeta, 'present');
        }),
        provenance: 'lexical-cross-checked',
        sources: [{ url: dexUrl('avea'), dictionary: DEX, checkedAt: CHECKED }],
      });
    }
    if (aveaImp.length) {
      tenses.push({
        tense: 'imperfect',
        forms: aveaImp.map((f) => ({
          ...f,
          ro: f.ro + suffix,
          en: f.en.replace('have', 'need').replace('had', 'needed'),
          pron: f.pron + ' neh-YO-eh deh',
        })),
        provenance: 'lexical-cross-checked',
        sources: [{ url: dexUrl('avea'), dictionary: DEX, checkedAt: CHECKED }],
      });
    }
    const aveaPc = verified['vb-avea'].find((t) => t.tense === 'perfect-compus');
    if (aveaPc) {
      tenses.push({
        tense: 'perfect-compus',
        forms: aveaPc.forms.map((f) => ({
          ...f,
          ro: f.ro.replace('avut', 'avut nevoie de'),
          en: f.en.replace('had', 'needed'),
        })),
        provenance: 'lexical-cross-checked',
        sources: [{ url: dexUrl('avea'), dictionary: DEX, checkedAt: CHECKED }],
      });
    }
    const aveaFut = verified['vb-avea'].find((t) => t.tense === 'future');
    if (aveaFut) {
      tenses.push({
        tense: 'future',
        forms: aveaFut.forms.map((f) => ({
          ...f,
          ro: f.ro.replace(/\b(am|ai|aibă|avem|aveți)\b/, (m) => `${m} nevoie de`),
          en: f.en.replace('have', 'need'),
        })),
        provenance: 'lexical-cross-checked',
        sources: [{ url: dexUrl('avea'), dictionary: DEX, checkedAt: CHECKED }],
      });
    }
    if (tenses.length) verified['vb-nevoie'] = tenses;
  }

  return verified;
}

function normalizeRo(s) {
  return s
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');
}

function nounDeclensionMatchesHeadword(key, decl) {
  if (!decl?.singular) return false;
  if (decl.singular === '—' || decl.singular.includes('&mdash')) return false;
  const k = normalizeRo(key);
  return (
    normalizeRo(decl.singular) === k ||
    (decl.plural && normalizeRo(decl.plural) === k)
  );
}

function adaptNounDeclension(key, decl) {
  const k = normalizeRo(key);
  if (normalizeRo(decl.singular) === k) return decl;
  // Plural-only headword (insecte, mici): use registry headword as singular when plural matches
  if (decl.plural && normalizeRo(decl.plural) === k) {
    return {
      ...decl,
      singular: key,
      plural: decl.plural,
      definiteSingular:
        normalizeRo(decl.singular) === k ? decl.definiteSingular : null,
    };
  }
  return null;
}

async function fetchNouns(cache) {
  if (!cache.nouns) cache.nouns = {};
  const result = {};
  const specs = nounFamilyCandidateRegistry;

  for (const [key, spec] of Object.entries(specs)) {
    if (key.includes(' ') || key.includes('-')) continue;

    let entry = cache.nouns[key];
    if (!entry?.declension) {
      process.stdout.write(`  fetch noun ${key}... `);
      const { url, html, status } = await fetchPage(key);
      await sleep(350);
      if (!html) {
        console.log(`FAIL ${status}`);
        cache.errors[`noun:${key}`] = `HTTP ${status}`;
        continue;
      }
      const declension = parseNounDeclension(html);
      if (!declension || !nounDeclensionMatchesHeadword(key, declension)) {
        console.log('no declension');
        cache.errors[`noun:${key}`] = 'no declension parsed or headword mismatch';
        continue;
      }
      const adapted = adaptNounDeclension(key, declension);
      if (!adapted) {
        console.log('headword mismatch');
        cache.errors[`noun:${key}`] = 'headword mismatch after adapt';
        continue;
      }
      entry = { url, declension: adapted };
      cache.nouns[key] = entry;
      console.log('ok');
    } else {
      console.log(`  cached noun ${key}`);
    }

    if (!entry?.declension) continue;

    result[key] = {
      decl: entry.declension,
      spec: {
        en: spec.singular?.en ?? key,
        pluralEn: spec.plural?.en,
        articleNote: spec.articleNote,
      },
    };
  }

  return result;
}

async function main() {
  console.log('Importing dexonline lexical data...');
  const cache = loadCache();
  const meta = buildMetadataIndex();
  let verifiedVerbs = {};
  let verifiedNouns = {};

  if (!nounsOnly) {
    console.log('\nVerbs:');
    verifiedVerbs = await fetchVerbs(cache, meta);
    console.log(`\n${Object.keys(verifiedVerbs).length} verbs with verified tenses`);
  }

  if (!verbsOnly) {
    console.log('\nNouns:');
    verifiedNouns = await fetchNouns(cache);
    console.log(`\n${Object.keys(verifiedNouns).length} nouns with verified declensions`);
  }

  saveCache(cache);

  if (!dryRun) {
    if (!nounsOnly) {
      writeFileSync(VERIFIED_VERBS_PATH, emitVerbFormsTs(verifiedVerbs));
      console.log(`Wrote ${VERIFIED_VERBS_PATH}`);
    }
    if (!verbsOnly) {
      writeFileSync(VERIFIED_NOUNS_PATH, emitNounFamiliesTs(null, verifiedNouns));
      console.log(`Wrote ${VERIFIED_NOUNS_PATH}`);
    }
  } else {
    console.log('\n[dry-run] Skipped writing output files');
  }

  const errors = Object.keys(cache.errors);
  if (errors.length) {
    console.log(`\n${errors.length} fetch/parse errors — see ${CACHE_PATH}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
