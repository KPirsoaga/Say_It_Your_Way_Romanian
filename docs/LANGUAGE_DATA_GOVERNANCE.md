# Romanian Language Data Governance

**Status:** Permanent platform policy  
**Applies to:** All Romanian language data in Say It Your Way Romanian  
**Audience:** Human developers, AI coding agents (including Cursor), content authors, migration scripts, generators, and future automated imports

---

## Core principle

Say It Your Way Romanian is a **language-learning application**. Incorrect Romanian is a **product defect**, not merely a content typo.

Romanian is morphologically complex. Lexical irregularity, stem changes, plural variation, attached articles, agreement, clitics, irregular verbs, and context-dependent usage **cannot safely be manufactured from apparent patterns**.

### Mandatory workflow

```
RESEARCH → VERIFY → RECORD PROVENANCE → PASS LANGUAGE SAFETY → PASS LANGUAGE QA → PUBLISH
```

### Forbidden workflow

```
GENERATE → ASSUME → PUBLISH → ASK THE TEACHER LATER
```

**AI language knowledge is not sufficient evidence.**  
**AI confidence is not verification.**

---

## Scope

These rules apply to every surface that presents Romanian to learners or teachers, including:

- Weekly Topics
- Dictionary and Word Family
- Grammar Help
- Daily Practice
- Phrase Builder
- Listen & Choose
- Real Life Mode
- Survival Romanian
- Mini Conversations
- Scenarios
- Teacher Review
- Search aliases
- Audio (TTS)
- Written pronunciation hints
- QR / share export (learner-visible Romanian pass-through)
- Future language-learning features

---

## Part 1 — External verification is mandatory

Whenever Romanian language content is **created, added, changed, corrected, expanded, conjugated, declined, inflected, translated, or used** in any learner-facing context (including exercises, answers, distractors, examples, readings, conversations, phrases, search aliases, or Word Families):

**External linguistic verification is mandatory.**

This is **not** “verify if uncertain.” It is **“verify because Romanian language data is being changed.”**

No developer or AI agent may skip verification because a form “looks obvious.”

---

## Part 2 — Verify the exact lexical item

Every lexical form must be verified against the **exact** lexical item.

| To verify | Research |
|-----------|----------|
| `câine` | `câine` |
| `bandă` | `bandă` |
| `a dormi` | `a dormi` / `dormi` |
| `bun` | `bun` |

**Never reason:**

- “This feminine noun follows the same pattern as…”
- “This looks like an -i verb…”
- “Romanian usually forms the plural by…”
- “This is probably…”

Patterns may be used to **understand** an already verified form, **identify** something requiring research, or **explain grammar** to the learner.

Patterns may **not** establish lexical truth.

---

## Part 3 — External source hierarchy

Use the strongest available source appropriate to the linguistic question.

1. **Romanian Academy / DOOM** normative evidence where accessible
2. **dexonline.ro** entries backed by recognised Romanian dictionaries and normative sources (DOOM, DEX, DOR, MDA, and similar)
3. **Other reputable Romanian linguistic or dictionary sources** when primary sources do not establish the required fact
4. **Supplied Romanian grammar references** for grammatical constructions, explanations, and terminology
5. **Teacher Review** for genuine ambiguity, naturalness, regional usage, contextual preference, pronunciation judgement, or conflicting authoritative evidence

### Do not use as primary linguistic authority

- Random blogs
- SEO vocabulary websites
- Anonymous conjugation pages
- Unsourced language-learning pages
- AI-generated websites
- Search snippets (without inspecting the entry)
- Another AI model
- Model memory

External internet research is **explicitly authorised and required** when repository sources do not establish the exact Romanian form.

---

## Part 4 — Source inspection

A search result is **not** verification.  
A search snippet is **not** verification.

The **actual source entry** must be inspected.

Verification should establish:

- Exact lexical item
- Exact form or construction being used
- Appropriate meaning
- Relevant grammatical information
- Source identity

Record provenance wherever the architecture supports it.

If a source establishes only part of a paradigm, **do not pretend** it establishes the whole paradigm.

---

## Part 5 — Provenance model

Preserve and enforce these safety tiers:

| Tier | Meaning |
|------|---------|
| **lexical-attested** | The exact lexical form is directly supported by authoritative lexical evidence |
| **lexical-composed** | Built from individually attested components **and** an independently validated grammatical construction |
| **teacher-validated** | Explicitly validated through the human teacher review process |
| **unresolved** | Evidence insufficient, conflicting, or incomplete |

**UNRESOLVED IS NOT LEARNER-SAFE.**

Do not silently convert `unresolved` into `lexical-composed` or `lexical-attested`.

### Compositional morphology example

Perfect Compus may be compositionally constructed using:

- verified auxiliary structure
- **+** individually verified participle

The complete composed form is **not** directly lexically attested unless the source attests the whole form. Label it `lexical-composed`.

---

## Part 6 — No morphology generation from patterns

Never generate learner-visible Romanian morphology from an apparent grammatical pattern.

This includes nouns (plural, definite forms, gender assumptions), verbs (all tenses, reflexive forms, imperative), adjectives (agreement variants), and pronouns/clitics.

A pattern-based generator **may** exist internally for:

- research candidates
- audit assistance
- identifying likely forms to verify

Its output must **never** automatically enter learner-facing data.

**Quarantined modules (research/candidate only):**

- `src/content/dictionary/nounFamilyBuilder.ts`
- `src/content/verbs/weeklyVerbPatterns.ts` (candidate builders)

---

## Part 7 — Canonical data only

There must be **one canonical linguistic source** for each fact.

Dictionary, Grammar Help, Daily Practice, Search, and other learner-facing features must consume the **canonical lexical API** (`src/content/lexical/canonical/`).

Do **not** maintain separate conjugation datasets per feature.

Feature code may determine **presentation**. Feature code must **not** independently determine **linguistic truth**.

---

## Part 8 — No canonical bypass

No learner-facing component may bypass:

- canonical lexical APIs
- `lexicalSafety.ts`
- learner-safe provenance gates

where grammatical variants are involved.

Automated checks in `scripts/language-governance-check.mjs` detect prohibited imports from deprecated morphology generators, candidate registries, and pattern-inferred data.

If a feature requires morphology, it must request **learner-safe canonical morphology**.

---

## Part 9 — Word Family is a permanent learning requirement

Accuracy must **never** be “fixed” by permanently reducing the application to base words where verified forms exist.

The learner must recognise a known Romanian word after its form changes.

Examples the product must support:

| Base | Changed forms |
|------|---------------|
| `câine` | `câini`, `câinele`, `câinii` |
| `a avea` | `am`, `ai`, `are`, `avem`, `aveți`, `au` |
| `bun` | `bună`, `buni`, `bune` |

Future changes must preserve: **“What base word does this changed form belong to?”**

---

## Part 10 — Practical meaning + formal grammar

The learning hierarchy is:

```
FORM → MEANING → BASE WORD → SIMPLE GRAMMATICAL RELATIONSHIP → FORMAL TERMINOLOGY
```

Example:

- `avem` → we have → base verb `a avea` → person: noi / we → tense: Present → formal: first-person plural, present indicative

Formal terminology is **not** a prerequisite for understanding meaning. It must **not** be removed entirely.

---

## Part 11 — Sentence-level verification

Verified individual words do **not** automatically make a sentence correct.

Any new or changed learner-facing Romanian sentence must be checked for syntax, word order, agreement, articles, pronouns, clitics, prepositions, tense, aspect, negation, question formation, politeness, register, idiomatic usage, naturalness, and English alignment.

Use external Romanian sources where appropriate. Use Teacher Review when sentence-level naturalness remains genuinely uncertain.

---

## Part 12 — Translation governance

Romanian–English and English–Romanian pairs must be verified for lexical meaning, person, number, tense, definiteness, gender, reflexive meaning, idiomatic meaning, register, and pragmatic meaning.

Never assume a mechanically constructed English gloss is correct. Never translate English word-for-word into Romanian and publish without verification.

---

## Part 13 — Exercise governance

Every learner-visible string counts as language content — **including wrong answer choices**.

Distractors must not:

- contain invented Romanian
- contain malformed morphology
- accidentally also be correct
- create semantic ambiguity
- teach a false relationship
- use an unsafe lexical form

Generated exercises must draw Romanian exclusively from learner-safe canonical data.

---

## Part 14 — Daily Practice

Daily Practice must reinforce **changed-form recognition**, not regress into headword-only testing.

Where learner-safe data exists, practice should include Romanian↔English, meaning/person/tense recognition, noun singular/plural, definite forms, adjective forms, and Listen & Choose.

Feedback must reconnect a changed form to its base word (see Part 9).

---

## Part 15 — Search

Only learner-safe forms may become grammatical search aliases (`câinii` → `câine`, `avem` → `a avea`, `bună` → `bun`).

Pattern-inferred, guessed, or unresolved forms must **never** enter search aliases.

---

## Part 16 — Audio

Audio must speak the Romanian form **actually displayed or tested**.

If the screen shows `câinii`, audio must speak `câinii` — not `câine`.  
If the exercise tests `avem`, audio must speak `avem` — not `a avea`.

---

## Part 17 — Written pronunciation

Written pronunciation guidance and audio are **different systems**.

Do not display autogenerated pronunciation hints as verified pronunciation. If written pronunciation has not been validated, use audio only. Do not manufacture English-style phonetic approximations merely to fill a field.

---

## Part 18 — Taxonomy

Do not force all vocabulary into ordinary noun/verb/adjective categories.

Preserve meaningful distinctions: inflectable noun, plural-only noun, compound noun, fixed expression, sign, phrase, loanword, verb, adjective, and other appropriate classes.

Do not manufacture a singular form because the data model expects one. Do not manufacture a noun family for a fixed road sign.

---

## Part 19 — Teacher Review boundaries

Teacher Review is the **last** validation layer, not a substitute for research.

Before sending something to Teacher Review:

1. Research the exact item
2. Inspect authoritative lexical evidence
3. Inspect relevant grammar evidence
4. Cross-check another reputable source where appropriate

Teacher Review is appropriate for ambiguity, naturalness, regional usage, register, pronunciation judgement, and conflicting evidence — **not** for routine morphology that authoritative sources can establish.

---

## Part 20 — Existing data is not automatically trusted

The following are **not** sufficient justification:

- “already in canonical data”
- “already in Grammar Help”
- “already in a Weekly Topic”
- “the build passes”
- “the model knows this”

Canonical means **structurally authoritative**. It does not automatically mean **linguistically correct**.

The full language audit (`LANGUAGE-AUDIT.md`) is the current baseline. Future changes must maintain it.

---

## Part 21 — New Weekly Topic language gate

Every future Weekly Topic must pass **mandatory language QA** before it is considered complete.

Audit: vocabulary, noun/verb/adjective families, readings, translations, newWords, MCQ prompts, correct answers, **every distractor individually**, matching pairs, sorting items, Today's Phrase content, audio strings, and search aliases generated from the topic.

Technical QA (`npm run typecheck`, `npm run build`) does **not** replace Language QA.

See `docs/WEEKLY_TOPIC_LANGUAGE_QA.md` for the checklist.

---

## Part 22 — PR language QA report

Any PR that introduces or changes Romanian learning content should include:

```
LANGUAGE QA
Romanian lexical items changed: X
Romanian sentences changed: X
External lexical checks performed: X
Directly attested forms: X
Compositionally verified forms: X
Teacher-validated: X
Unresolved: X
Learner-facing unresolved forms: MUST BE 0 (unless explicitly displayed as uncertain/non-teaching)
Sources used: [list]
Language QA: PASS / FAIL
```

---

## Part 23 — Automated language QA

Run before merge when Romanian language data may have changed:

```bash
npm run language:qa
```

This orchestrates provenance checks, canonical bypass detection, regression tests, and audit scripts. See `docs/LANGUAGE_SENSITIVE_PATHS.md` for files that trigger Language QA.

### Automated QA vs full human audit

Automated Language QA verifies:

- provenance tiers
- safe data flow
- canonical traceability
- generator constraints
- known regression conditions

It does **not** prove that newly authored Romanian prose is natural or correct.

**A green `npm run language:qa` is necessary but not sufficient for new Romanian prose.** New sentences require external/manual linguistic verification per Parts 1, 11, and 12.

---

## Part 24 — Failure behaviour

If verification cannot establish a Romanian form:

- **DO NOT** guess
- **DO NOT** generate
- **DO NOT** use model knowledge
- **DO NOT** fall back to a pattern
- **DO NOT** silently publish

Mark `unresolved` and prevent it entering learner-facing morphological systems.

**A missing form is preferable to a false form.**

---

## Part 25 — Coverage must never drive invention

Do not use coverage %, completion %, family completeness %, exercise pool size, or search alias count as reasons to generate plausible Romanian.

**Accuracy always outranks coverage.**

The correct result may be 86 verified noun families rather than 113 apparently complete but partly invented families.

---

## Part 26 — Golden learner acceptance test

A learner knows `a avea` = to have, `câine` = dog, `bun` = good.

When they encounter `avem`, `câinii`, `bună`, the system must help them understand:

1. What does this mean?
2. What base word does it belong to?
3. How has it changed?
4. What simple grammatical information explains it?
5. What is the formal grammatical terminology?
6. How does it sound?
7. Where can I see the rest of the Word Family?
8. Can I practise recognising it again?

Future architecture or UX changes must preserve this capability.

---

## Part 27 — Commands and scripts

| Command | Purpose |
|---------|---------|
| `npm run language:qa` | Full automated language QA suite |
| `npx tsx scripts/pre-merge-lexical-check.mjs` | Lexical safety regression |
| `npx tsx scripts/language-governance-check.mjs` | Bypass detection + provenance enforcement |
| `npx tsx scripts/acceptance-matrix.mjs` | Golden-path acceptance (11 cases) |
| `npx tsx scripts/audit-grammar-examples.mjs` | Grammar Help example sentences |
| `npx tsx scripts/audit-daily-practice-qa.mjs` | Daily Practice deterministic QA |
| `npx tsx scripts/audit-mcq-distractors.mjs` | Weekly Topic MCQ distractors |
| `npx tsx scripts/audit-qr-share.mjs` | QR/share pass-through audit |
| `npx tsx scripts/language-audit-inventory.mjs` | Content inventory counts |

---

## Part 28 — Related documents

- `LANGUAGE-AUDIT.md` — completed baseline audit
- `docs/LANGUAGE_SENSITIVE_PATHS.md` — change-detection paths
- `docs/WEEKLY_TOPIC_LANGUAGE_QA.md` — new topic checklist
- `VALIDATION.md` — platform validation register (VAL-060)
- `AGENTS.md` — AI agent instructions
