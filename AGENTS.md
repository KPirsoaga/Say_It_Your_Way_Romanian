# Agent instructions — Say It Your Way Romanian

## Romanian language data (mandatory)

Before creating or modifying **any learner-facing Romanian content**, read and comply with:

**[docs/LANGUAGE_DATA_GOVERNANCE.md](docs/LANGUAGE_DATA_GOVERNANCE.md)**

### Non-negotiable rules

1. **External verification is mandatory** whenever Romanian language data is created or changed — not only when uncertain.
2. **AI confidence is not verification.** Never use model knowledge as linguistic evidence.
3. **Verify the exact lexical item** (e.g. research `bandă`, not “feminine -ă nouns”).
4. **Never generate learner-facing morphology from patterns.** Pattern generators in `nounFamilyBuilder.ts` and `weeklyVerbPatterns.ts` are research/candidate only.
5. **Use the canonical lexical API** (`src/content/lexical/canonical/`). Do not bypass `lexicalSafety.ts`.
6. **Unresolved forms are not learner-safe.** A missing form is better than a false form.
7. **Accuracy outranks coverage.** Do not invent Romanian to fill gaps.
8. **Preserve Word Family** — do not reduce to headwords where verified forms exist.
9. **Sentence-level verification** is required for new/changed Romanian prose, even when individual words are verified.
10. Run **`npm run language:qa`** before merging changes to language-sensitive paths (see `docs/LANGUAGE_SENSITIVE_PATHS.md`).

### Workflow

```
RESEARCH → VERIFY → RECORD PROVENANCE → PASS LANGUAGE SAFETY → PASS LANGUAGE QA → PUBLISH
```

### New Weekly Topics

Use the checklist: **[docs/WEEKLY_TOPIC_LANGUAGE_QA.md](docs/WEEKLY_TOPIC_LANGUAGE_QA.md)**

### Baseline audit

Completed audit: **[LANGUAGE-AUDIT.md](LANGUAGE-AUDIT.md)** — maintain this baseline; do not regress.
