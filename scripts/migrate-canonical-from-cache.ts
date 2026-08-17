#!/usr/bin/env node
/**
 * Regenerate verifiedVerbForms.ts from dexonline cache with honest provenance,
 * corrected EN glosses, and audio-only pronunciation policy.
 * Run: npx tsx scripts/migrate-canonical-from-cache.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonicalGrammarVerbs } from '../src/content/verbs/canonicalVerbs.ts';
import { canonicalVerbBase } from '../src/content/verbs/canonicalVerbBase.ts';
import { verbTenseSupplement } from '../src/content/verbs/canonicalVerbTenses.ts';
import { buildVerbEnGloss, pronStatusForForm } from '../src/content/lexical/canonical/enGloss.ts';
import { cleanMergedForm } from './lib/dexonline-parser.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CACHE_PATH = join(ROOT, 'src/content/lexical/dexonline-cache.json');
const OUT_PATH = join(ROOT, 'src/content/verbs/verifiedVerbForms.ts');

const DEX = 'DEX / DOOM via dexonline.ro';
const CHECKED = '2026-08-17';
const LABELS = ['eu', 'tu', 'el/ea', 'noi', 'voi', 'ei/ele'] as const;

type GrammarTense = 'present' | 'perfect-compus' | 'imperfect' | 'future';

function escapeStr(s: string) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function buildMetadataIndex() {
  const byId: Record<string, { infinitive: string; en: string; tenses: Record<string, Record<string, { ro?: string; en?: string; pron?: string }>> }> = {};
  for (const verb of canonicalGrammarVerbs) {
    byId[verb.id] = { infinitive: verb.infinitive, en: verb.en, tenses: {} };
    const add = (tense: string, forms?: { label: string; ro: string; en: string; pron?: string }[]) => {
      if (!forms?.length) return;
      byId[verb.id]!.tenses[tense] = Object.fromEntries(forms.map((f) => [f.label, { ro: f.ro, en: f.en, pron: f.pron }]));
    };
    add('present', verb.present);
    add('imperfect', verb.imperfect);
    add('perfect-compus', verb.perfectCompus);
    add('future', verb.future);
    const sup = verbTenseSupplement[verb.id];
    if (sup) {
      add('imperfect', sup.imperfect);
      add('perfect-compus', sup.perfectCompus);
      add('future', sup.future);
    }
  }
  for (const verb of canonicalVerbBase) {
    if (!byId[verb.id]) byId[verb.id] = { infinitive: verb.infinitive, en: verb.en, tenses: {} };
    const add = (tense: string, forms?: { label: string; ro: string; en: string; pron?: string }[]) => {
      if (!forms?.length) return;
      byId[verb.id]!.tenses[tense] = { ...byId[verb.id]!.tenses[tense], ...Object.fromEntries(forms.map((f) => [f.label, { ro: f.ro, en: f.en, pron: f.pron }])) };
    };
    add('present', verb.present);
    add('imperfect', verb.imperfect);
  }
  return byId;
}

function tenseMeta(tense: GrammarTense, reflexive: boolean) {
  switch (tense) {
    case 'present':
      return {
        safetyTier: reflexive ? 'lexical-composed' : 'lexical-attested',
        provenance: reflexive ? 'lexical-cross-checked' : 'lexical-explicit',
        composition: reflexive ? { rule: 'reflexive-clitic', attestedComponents: ['verb stem (dexonline)'] } : undefined,
      };
    case 'imperfect':
      return {
        safetyTier: reflexive ? 'lexical-composed' : 'lexical-attested',
        provenance: reflexive ? 'lexical-cross-checked' : 'lexical-explicit',
        composition: reflexive ? { rule: 'reflexive-clitic', attestedComponents: ['verb stem (dexonline)'] } : undefined,
      };
    case 'perfect-compus':
      return {
        safetyTier: 'lexical-composed',
        provenance: 'lexical-cross-checked',
        composition: { rule: 'perfect-compus', attestedComponents: ['participiu (dexonline)', 'auxiliary a avea/a fi'] },
      };
    case 'future':
      return {
        safetyTier: 'lexical-composed',
        provenance: 'lexical-cross-checked',
        composition: { rule: 'future-periphrastic', attestedComponents: ['conjunctiv prezent (dexonline)', 'o să'] },
      };
  }
}

function isCorruptedRo(ro: string): boolean {
  return /&#x|&#\d|&[a-z]+;/i.test(ro) || /\u2011/.test(ro);
}

/** Prefer curated canonical forms when cache has merged dexonline variants */
function resolveRo(cacheRo: string, curated?: { ro?: string }): string {
  const curatedRo = curated?.ro?.trim();
  let cleaned = cleanMergedForm(cacheRo);
  if (curatedRo) {
    if (!cleaned || isCorruptedRo(cleaned)) return curatedRo;
    if (cleaned.startsWith(curatedRo) && cleaned.length > curatedRo.length + 1) return curatedRo;
    if (curatedRo.startsWith(cleaned) && curatedRo.length <= cleaned.length + 2) return curatedRo;
  }
  return cleaned || curatedRo || '';
}

function makeForm(label: string, ro: string, tense: GrammarTense, verbEn: string, curated?: { en?: string; pron?: string; ro?: string }) {
  const resolvedRo = resolveRo(ro, curated);
  const { en } = buildVerbEnGloss(label, resolvedRo, tense, verbEn, curated);
  const pronStatus = pronStatusForForm(curated?.pron, resolvedRo);
  const pron = pronStatus === 'verified' ? curated!.pron! : resolvedRo;
  return { label, ro: resolvedRo, en, pron: pronStatus === 'verified' ? pron : resolvedRo };
}

function applyReflexiveOverrides(verb: { infinitive: string }, paradigm: Record<string, { label: string; ro: string }[]>, meta: ReturnType<typeof buildMetadataIndex>[string]) {
  if (!verb.infinitive.startsWith('a se ')) return paradigm;
  const cliticPrefix = ['mă', 'te', 'se', 'ne', 'vă', 'se'];
  const withClitic = (stem: string, i: number) => {
    const existing = meta?.tenses?.present?.[LABELS[i]]?.ro ?? meta?.tenses?.imperfect?.[LABELS[i]]?.ro ?? '';
    if (existing && (existing.endsWith(stem) || existing.includes(` ${stem}`))) {
      return existing.replace(/^să\s+/, '');
    }
    return `${cliticPrefix[i]} ${stem}`;
  };
  return {
    ...paradigm,
    present: LABELS.map((label, i) => ({ label, ro: withClitic(paradigm.present[i]!.ro, i) })),
    subjunctive: LABELS.map((label, i) => ({ label, ro: paradigm.subjunctive[i]?.ro ?? '' })),
    imperfect: LABELS.map((label, i) => ({
      label,
      ro: meta?.tenses?.imperfect?.[label]?.ro ?? withClitic(paradigm.imperfect[i]?.ro ?? '', i),
    })),
  };
}

function rebuildFromCache() {
  const cache = JSON.parse(readFileSync(CACHE_PATH, 'utf8'));
  const meta = buildMetadataIndex();
  const out: Record<string, unknown[]> = {};

  for (const verb of canonicalGrammarVerbs) {
    if (verb.id === 'vb-nevoie') continue;
    const entry = cache.verbs[verb.id];
    if (!entry?.paradigm) continue;
    const m = meta[verb.id];
    const reflexive = verb.infinitive.startsWith('a se ');
    let p = entry.paradigm;
    p = applyReflexiveOverrides(verb, p, m);
    const tenses = [];
    const src = { url: entry.url, dictionary: DEX, checkedAt: CHECKED };

    if (p.present?.every((x: { ro: string }) => x.ro)) {
      const tm = tenseMeta('present', reflexive);
      tenses.push({
        tense: 'present',
        forms: p.present.map(({ label, ro }: { label: string; ro: string }) =>
          makeForm(label, ro, 'present', m?.en ?? verb.en, m?.tenses.present?.[label])
        ),
        provenance: tm.provenance,
        safetyTier: tm.safetyTier,
        composition: tm.composition,
        sources: [src],
      });
    }
    if (p.imperfect?.every((x: { ro: string }) => x.ro)) {
      const tm = tenseMeta('imperfect', reflexive);
      tenses.push({
        tense: 'imperfect',
        forms: p.imperfect.map(({ label, ro }: { label: string; ro: string }) =>
          makeForm(label, ro, 'imperfect', m?.en ?? verb.en, m?.tenses.imperfect?.[label])
        ),
        provenance: tm.provenance,
        safetyTier: tm.safetyTier,
        composition: tm.composition,
        sources: [src],
      });
    }
    if (p.participiu) {
      const tm = tenseMeta('perfect-compus', false);
      const aux = [
        ['am', 'eu'],
        ['ai', 'tu'],
        ['a', 'el/ea'],
        ['am', 'noi'],
        ['ați', 'voi'],
        ['au', 'ei/ele'],
      ] as const;
      tenses.push({
        tense: 'perfect-compus',
        forms: aux.map(([a, label]) => {
          const ro = `${a} ${p.participiu}`;
          return makeForm(label, ro, 'perfect-compus', m?.en ?? verb.en, m?.tenses['perfect-compus']?.[label]);
        }),
        provenance: tm.provenance,
        safetyTier: tm.safetyTier,
        composition: { ...tm.composition, attestedComponents: [p.participiu, 'a avea/a fi'] },
        sources: [src],
      });
    }
    if (p.subjunctive?.every((x: { ro: string }) => x.ro)) {
      const tm = tenseMeta('future', false);
      const clitic = ['mă', 'te', 'se', 'ne', 'vă', 'se'];
      tenses.push({
        tense: 'future',
        forms: p.subjunctive.map(({ label, ro }: { label: string; ro: string }, i: number) => {
          const roForm =
            reflexive && m?.tenses.present?.[label]?.ro
              ? `o să ${clitic[i]} ${ro}`
              : `o să ${ro}`;
          return makeForm(label, roForm, 'future', m?.en ?? verb.en, m?.tenses.future?.[label]);
        }),
        provenance: tm.provenance,
        safetyTier: tm.safetyTier,
        composition: tm.composition,
        sources: [src],
      });
    }
    if (tenses.length) out[verb.id] = tenses;
  }

  // vb-nevoie compound from curated base + avea attested forms
  const nevoieVerb = canonicalGrammarVerbs.find((v) => v.id === 'vb-nevoie');
  const aveaTenses = out['vb-avea'] as { tense: string; forms: { label: string; ro: string; en: string; pron: string }[] }[] | undefined;
  if (nevoieVerb && aveaTenses) {
    const suffix = ' nevoie de';
    const src = [{ url: 'https://dexonline.ro/definitie/avea', dictionary: DEX, checkedAt: CHECKED }];
    const t: unknown[] = [
      {
        tense: 'present',
        forms: nevoieVerb.present.map((f) => makeForm(f.label, f.ro, 'present', nevoieVerb.en, f)),
        provenance: 'lexical-cross-checked',
        safetyTier: 'lexical-composed',
        composition: { rule: 'compound-phrase', attestedComponents: ['a avea (dexonline)', 'nevoie de (lexical phrase)'] },
        sources: src,
      },
    ];
    const imp = aveaTenses.find((x) => x.tense === 'imperfect');
    if (imp) {
      t.push({
        tense: 'imperfect',
        forms: imp.forms.map((f) =>
          makeForm(f.label, f.ro + suffix, 'imperfect', nevoieVerb.en, {
            en: f.en.replace(/\bhad\b/g, 'needed').replace(/\bhave\b/g, 'need'),
            pron: f.pron,
          })
        ),
        provenance: 'lexical-cross-checked',
        safetyTier: 'lexical-composed',
        composition: { rule: 'compound-phrase', attestedComponents: ['a avea imperfect', 'nevoie de'] },
        sources: src,
      });
    }
    const pc = aveaTenses.find((x) => x.tense === 'perfect-compus');
    if (pc) {
      t.push({
        tense: 'perfect-compus',
        forms: pc.forms.map((f) =>
          makeForm(f.label, f.ro.replace('avut', 'avut nevoie de'), 'perfect-compus', nevoieVerb.en, {
            en: f.en.replace(/\bhad\b/g, 'needed'),
            pron: f.pron,
          })
        ),
        provenance: 'lexical-cross-checked',
        safetyTier: 'lexical-composed',
        composition: { rule: 'compound-phrase', attestedComponents: ['a avea perfect compus', 'nevoie de'] },
        sources: src,
      });
    }
    const fut = aveaTenses.find((x) => x.tense === 'future');
    if (fut) {
      t.push({
        tense: 'future',
        forms: fut.forms.map((f) =>
          makeForm(
            f.label,
            f.ro.replace(/\b(am|ai|aibă|avem|aveți)\b/, (match) => `${match} nevoie de`),
            'future',
            nevoieVerb.en,
            { en: f.en.replace(/\bhave\b/g, 'need'), pron: f.pron }
          )
        ),
        provenance: 'lexical-cross-checked',
        safetyTier: 'lexical-composed',
        composition: { rule: 'compound-phrase', attestedComponents: ['a avea future', 'nevoie de'] },
        sources: src,
      });
    }
    out['vb-nevoie'] = t;
  }

  return out;
}

function emitTs(verified: Record<string, unknown[]>) {
  const lines: string[] = [];
  lines.push(`import type { GrammarTense, VerbForm } from '../../types';`);
  lines.push(`import type { LexicalSourceRef } from '../validation/lexicalSafety';`);
  lines.push(`import type { CompositionRule, LexicalSafetyTier } from '../lexical/canonical/types';`);
  lines.push('');
  lines.push(`export interface FormComposition {`);
  lines.push(`  rule: CompositionRule;`);
  lines.push(`  attestedComponents: string[];`);
  lines.push(`}`);
  lines.push('');
  lines.push(`export interface VerifiedVerbTense {`);
  lines.push(`  tense: GrammarTense;`);
  lines.push(`  forms: VerbForm[];`);
  lines.push(`  /** @deprecated use safetyTier */`);
  lines.push(`  provenance: 'lexical-explicit' | 'lexical-cross-checked' | 'teacher-validated';`);
  lines.push(`  safetyTier: LexicalSafetyTier;`);
  lines.push(`  composition?: FormComposition;`);
  lines.push(`  sources: LexicalSourceRef[];`);
  lines.push(`}`);
  lines.push('');
  lines.push(`const DEX = '${DEX}';`);
  lines.push(`const CHECKED = '${CHECKED}';`);
  lines.push(`const LABELS = ['eu', 'tu', 'el/ea', 'noi', 'voi', 'ei/ele'] as const;`);
  lines.push('');
  lines.push(`function vf(rows: [string, string, string][]): VerbForm[] {`);
  lines.push(`  return rows.map(([ro, en, pron], i) => ({`);
  lines.push(`    label: LABELS[i] ?? ('p' + i),`);
  lines.push(`    ro, en, pron: pron || ro,`);
  lines.push(`  }));`);
  lines.push(`}`);
  lines.push('');
  lines.push(`/** Canonical verb morphology — generated by scripts/migrate-canonical-from-cache.mjs */`);
  lines.push(`export const verifiedVerbTenses: Record<string, VerifiedVerbTense[]> = {`);

  for (const id of Object.keys(verified).sort()) {
    const tenses = verified[id] as {
      tense: string;
      forms: { label: string; ro: string; en: string; pron: string }[];
      provenance: string;
      safetyTier: string;
      composition?: { rule: string; attestedComponents: string[] };
      sources: { url: string }[];
    }[];
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
      lines.push(`      safetyTier: '${t.safetyTier}',`);
      if (t.composition) {
        lines.push(`      composition: { rule: '${t.composition.rule}', attestedComponents: ${JSON.stringify(t.composition.attestedComponents)} },`);
      }
      lines.push(`      sources: [{ url: '${t.sources[0]!.url}', dictionary: DEX, checkedAt: CHECKED }],`);
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
  lines.push(`  const t = getVerifiedTensesForVerb(verbId).find((v) => v.tense === tense);`);
  lines.push(`  return Boolean(t && t.safetyTier !== 'unresolved');`);
  lines.push(`}`);
  lines.push('');
  lines.push(`export function getLearnerSafeVerbForms(verbId: string, tense: GrammarTense): VerbForm[] | undefined {`);
  lines.push(`  const match = getVerifiedTensesForVerb(verbId).find((v) => v.tense === tense);`);
  lines.push(`  return match?.forms;`);
  lines.push(`}`);
  lines.push('');
  writeFileSync(OUT_PATH, lines.join('\n'));
  console.log(`Wrote ${OUT_PATH} (${Object.keys(verified).length} verbs)`);
}

const verified = rebuildFromCache();
emitTs(verified);
