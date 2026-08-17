# Platform Romanian Language Audit

**Date:** 2026-08-17  
**Scope:** All learner-facing Romanian content areas  
**Method:** Content review against dexonline.ro verification hierarchy; no pattern-inferred morphology restored

## Areas reviewed

| Area | Files / surfaces | Result |
|------|------------------|--------|
| Dictionary headwords & families | `buildDictionary.ts`, `verifiedLexicalFamilies.ts`, `verifiedVerbForms.ts` | Pass with corrections noted below |
| Dictionary search aliases | `buildDictionary.ts` alias builder | Pass — headword priority over conflicting adjective aliases |
| Word Family UI | `WordFamily.tsx` | Pass — terminology + provenance badges |
| Grammar Help verbs | `GrammarVerbPage.tsx`, `canonicalVerbTenses.ts` | Pass — 71/71 verbs, 4 tenses each |
| Grammar Help extended | `grammarExtended.ts`, `grammarTenseGuides.ts` | Teacher Review (pre-existing) |
| Weekly Topics (4 topics) | `weeklyTopics/*.ts` | Teacher Review flags intact |
| Daily Practice | `generateSession.ts` | Pass — all 4 verb tenses in pool |
| Survival / Real Life / Scenarios | `content.ts`, scenario files | No morphology invented |
| Phrase Builder | `PhraseBuilder.tsx` | Uses phrase content only |
| Pronunciation display | `enGloss.ts` `pronStatusForForm` | Unverified pron hidden in canonical layer |
| Teacher Review queue | `reviewRegistry.ts`, entry `review` fields | 8 dictionary items + supplemental grammar items |

## Errors discovered

1. **Perfect-compus EN glosses** — systematic errors (`I has accelerate`, `he/she has ring`, etc.) across regenerated verb data.
2. **Adjective alias collision** — `mici` (plural-only food noun) lost search priority to adjective `mic` plural alias.
3. **Missing dictionary headword** — `bun` adjective used in phrases but absent as dictionary entry.
4. **Noun EN gloss** — `ambreiaje` glossed as `clutchs` / `the clutchs`.
5. **3sg present EN** — `he/she accelerate` (missing -s) in some regenerated forms.
6. **Reflexive verb ID** — acceptance tooling referenced `vb-juca` instead of `vb-se-juca` (code issue, not content).
7. **Pre-existing Teacher Review items** — pod homonymy, mici food term explanation, camping loanword, off-topic cabin verbs, road-sign phrasing.

## Errors corrected (this implementation)

| Item | Change | Source |
|------|--------|--------|
| Perfect-compus EN glosses | Rejected bad curated glosses; rebuilt with `have/has + participle` + irregular map | `enGloss.ts` + migration regen |
| `adus` participle EN | Added irregular `brought` | `enGloss.ts` |
| `ambreiaje` EN | `clutches` / `the clutches` | `verifiedLexicalFamilies.ts` |
| `mici` search | Headword-priority alias rule | `buildDictionary.ts` |
| `bun` dictionary entry | Seeded essential adjective headword | `buildDictionary.ts` |
| `mic`, `greu` adjectives | Full 4-form families from dexonline | `verifiedLexicalFamilies.ts` |
| Signs / plural-only taxonomy | `entryClass` set; no false word families | `entryTaxonomy.ts`, `finalizeEntry` |

## Unresolved items (not inferable from hierarchy)

| Item | Reason |
|------|--------|
| `extensie` | dexonline lemma mismatch — remains base-only |
| `pod` | Homonym (attic vs bridge) — multiple senses flagged |
| Compound nouns (`centură de siguranță`, etc.) | No single-word dexonline declension table |
| Plural-only nouns (`insecte`, `cârnați`, …) | No verified singular lemma on dexonline |

## Teacher Review items (sent / retained)

- `pod` — multiple meanings  
- `mici` — food term learner explanation  
- `camping` — loanword naturalness  
- `Cedează trecerea` — regulatory phrasing  
- `a găti`, `a lovi` — off-topic for cabin topic  
- `a întreba`, `a pleca` — example sentence naturalness  
- Grammar Help imperfect / parts-of-speech examples (`reviewRegistry.ts`)  
- Weekly topic-level review flags (bbq, dog walkers, driving, camping)

## Attested vs composed morphology

| Metric | Count |
|--------|------:|
| Attested tense blocks | 134 |
| Composed tense blocks | 150 |
| Attested verb forms | 804 |
| Composed verb forms | 900 |

Composition rules used: `perfect-compus`, `future-periphrastic`, `reflexive-clitic`, `compound-phrase` (a avea nevoie de).

## Noun / adjective / verb taxonomy

| Class | Dictionary count | Verified inflectable |
|-------|-----------------:|---------------------:|
| Inflectable noun | 87 | 86 |
| Plural-only noun | 9 | 0 (by design) |
| Sign | 7 | 0 (by design) |
| Compound noun | 9 | partial / base-only |
| Loanword | 1 | 0 |
| Verb | 71 grammar + topic verbs | 71 with 4 tenses |
| Adjective | 4 | 4 (`bun`, `mare`, `mic`, `greu`) |

## Pronunciation data

- **Policy:** `pron === ro` treated as audio-only; not shown as verified phonetic spelling.
- **Removed from display:** Unverified pron on canonical verb/noun/adjective forms.
- **Retained:** Curated pron on phrases and weekly vocab where explicitly authored.

## Daily Practice coverage

| Pool | Forms |
|------|------:|
| Present | 426 |
| Perfect compus | 426 |
| Imperfect | 426 |
| Future | 426 |
| Noun morphology | 344 |
| Adjective morphology | 16 |
| Headword recognition | 179 |

Exercise types include: `which-person`, `which-tense`, `which-form-class` (grammar recognition) plus existing meaning/listen drills.

## Acceptance matrix

All 11 mandated examples pass (`scripts/acceptance-matrix.mjs`).
