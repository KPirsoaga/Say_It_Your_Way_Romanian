# Language-Sensitive Paths

When a pull request modifies any path listed below, **Language QA is mandatory** before merge.

Run:

```bash
npm run language:qa
```

If the PR introduces or changes **authored Romanian sentences** (readings, examples, conversations, phrases), automated QA alone is **not sufficient** — perform external/manual verification per `docs/LANGUAGE_DATA_GOVERNANCE.md`.

---

## Romanian content (always requires Language QA)

| Path | Content type |
|------|----------------|
| `src/content/weeklyTopics/**` | Weekly Topic vocabulary, readings, exercises, distractors |
| `src/content/verbs/canonicalVerbBase.ts` | Grammar Help example sentences |
| `src/content/verbs/canonicalVerbTenses.ts` | Grammar Help tense examples |
| `src/content/verbs/verifiedVerbForms.ts` | Verified verb morphology |
| `src/content/dictionary/verifiedLexicalFamilies.ts` | Verified noun/adjective families |
| `src/content.ts` | Scenarios, Real Life, Survival, Mini Conversations |
| `src/content/additions.ts` | Supplemental learner content |
| `src/content/grammar*.ts` | Grammar Help explanatory content |
| `src/content/grammarExtended.ts` | Extended grammar topics |
| `src/content/grammarCheatSheets.ts` | Cheat sheet content |
| `src/content/weeklyTopics/cabinPhraseBuilder.ts` | Phrase Builder items |
| `src/content/review/reviewRegistry.ts` | Teacher Review catalog |
| `src/content/dailyPractice/generateSession.ts` | Daily Practice generator logic |

## Canonical / safety infrastructure (requires Language QA + governance check)

| Path | Role |
|------|------|
| `src/content/lexical/canonical/**` | Canonical lexical API |
| `src/content/validation/lexicalSafety.ts` | Learner-safe provenance gates |
| `src/content/dictionary/buildDictionary.ts` | Dictionary, aliases, variant pool |
| `src/content/dictionary/familyUtils.ts` | Word Family chains |
| `src/content/dictionary/entryTaxonomy.ts` | Lexical class taxonomy |

## Research-only (must NOT feed learner-facing code)

| Path | Role |
|------|------|
| `src/content/dictionary/nounFamilyBuilder.ts` | Pattern candidate generator |
| `src/content/verbs/weeklyVerbPatterns.ts` | Verb pattern candidates |
| `src/content/dictionary/curatedFamilies.ts` | Legacy curated families (validation only) |

Changes to research-only paths still require confirmation that no learner-facing import was added.

## Audit and governance scripts

| Path | Role |
|------|------|
| `scripts/pre-merge-lexical-check.mjs` | Pre-merge regression |
| `scripts/language-governance-check.mjs` | Bypass + provenance enforcement |
| `scripts/acceptance-matrix.mjs` | Golden-path acceptance |
| `scripts/audit-*.mjs` | Content audit scripts |
| `docs/LANGUAGE_DATA_GOVERNANCE.md` | Policy changes |

---

## PR checklist (quick)

- [ ] `npm run language:qa` passes
- [ ] External verification performed for every changed Romanian form/sentence
- [ ] Provenance recorded (`lexical-attested`, `lexical-composed`, `teacher-validated`, or `unresolved`)
- [ ] Learner-facing unresolved forms: **0**
- [ ] LANGUAGE QA report included in PR description (see governance doc Part 22)
- [ ] No imports from research-only generators in learner-facing code
