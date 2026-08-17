# Weekly Topic Language QA Checklist

Every new or substantially revised Weekly Topic must pass this checklist **before** the topic is considered complete.

Technical build success (`npm run typecheck`, `npm run build`) does **not** satisfy this gate.

Reference: `docs/LANGUAGE_DATA_GOVERNANCE.md`

---

## 1. Vocabulary

- [ ] Every Romanian vocabulary item individually verified (exact lexical item researched)
- [ ] English glosses verified for person, tense, number, definiteness, register
- [ ] Diacritics correct
- [ ] No pattern-inferred morphology in vocabulary strings
- [ ] Verb infinitives link to verified Grammar Help / Dictionary entries where applicable
- [ ] Noun/adjective items respect taxonomy (no invented singular for plural-only items, etc.)

## 2. Noun / adjective families

- [ ] Only learner-safe forms from `verifiedLexicalFamilies.ts` (or newly verified and registered)
- [ ] No use of `nounFamilyBuilder.ts` output in learner-facing data
- [ ] `unresolved` forms quarantined — not in Word Family, search, or exercises

## 3. Verb forms

- [ ] Only learner-safe forms from `verifiedVerbForms.ts`
- [ ] No pattern-generated conjugations from `weeklyVerbPatterns.ts` in learner exercises
- [ ] Composed tenses labelled `lexical-composed`, not `lexical-attested`

## 4. Readings

- [ ] Every Romanian sentence checked for syntax, agreement, articles, clitics, word order, naturalness
- [ ] English translations aligned (person, tense, number, register)
- [ ] `newWords` list accurate; English glosses verified
- [ ] Uncertain naturalness flagged for Teacher Review (not silently published)

## 5. Exercises — every item individually

### MCQ (RO→EN and EN→RO)

- [ ] Prompt verified
- [ ] Correct answer verified
- [ ] **Every distractor individually verified** — must be valid Romanian even when wrong
- [ ] No distractor is also a correct answer for this question
- [ ] No invented or malformed morphology in distractors

### Matching

- [ ] Every Romanian string in pairs verified
- [ ] No ambiguous pairings

### Sorting

- [ ] Every Romanian sort item verified
- [ ] Categories linguistically coherent

## 6. Today's Phrase (if used)

- [ ] Phrase verified sentence-level
- [ ] English alignment verified

## 7. Audio

- [ ] TTS speaks the displayed/tested form (not the base word unless that is what is displayed)

## 8. Search aliases

- [ ] Any aliases generated from topic forms trace to verified morphology only
- [ ] No unresolved forms as aliases

## 9. Automated checks

```bash
npm run language:qa
npx tsx scripts/audit-mcq-distractors.mjs
```

## 10. PR report

Include the LANGUAGE QA report template from `docs/LANGUAGE_DATA_GOVERNANCE.md` Part 22.

**Topic is complete only when all applicable items are checked and Language QA is PASS.**
