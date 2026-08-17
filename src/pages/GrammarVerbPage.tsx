import { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { GrammarExamples } from '../components/GrammarExamples';
import { GrammarConjugationCards } from '../components/GrammarConjugationCards';
import { GrammarVerbNav } from '../components/GrammarVerbNav';
import { GrammarTenseToggle } from '../components/GrammarTenseToggle';
import { Icon } from '../components/Icon';
import { colorMap, grammarVerbs } from '../content';
import { getAvailableTenses, getVerbExamplesForTense, getVerbFormsForTense } from '../content/grammarVerbTenses';
import { verifiedTenseCoverageLabel } from '../content/dictionary/familyUtils';
import { getCanonicalVerb } from '../content/lexical/canonical';
import { formalGrammarLabel } from '../content/lexical/canonical/terminology';
import { safetyTierLabel } from '../content/validation/lexicalSafety';
import type { GrammarTense } from '../types';
import { GRAMMAR_TENSE_LABELS } from '../types';

interface Props {
  verbId: string;
  onBack: () => void;
  onNavigate: (verbId: string) => void;
}

export function GrammarVerbPage({ verbId, onBack, onNavigate }: Props) {
  const verb = grammarVerbs.find((v) => v.id === verbId);
  const availableTenses = useMemo(() => (verb ? getAvailableTenses(verb) : []), [verb]);
  const [tense, setTense] = useState<GrammarTense>('present');

  useEffect(() => {
    setTense(availableTenses[0] ?? 'present');
  }, [verbId, availableTenses]);

  const activeTense = availableTenses.includes(tense) ? tense : availableTenses[0];
  const forms = verb && activeTense ? getVerbFormsForTense(verb, activeTense) : undefined;
  const examples = verb && activeTense ? getVerbExamplesForTense(verb, activeTense) : [];
  const coverageNote = verb ? verifiedTenseCoverageLabel(verb.id) : undefined;
  const canonical = verb ? getCanonicalVerb(verb.id, verb.infinitive, verb.en) : undefined;
  const canonicalTense = canonical?.tenses.find((t) => t.tense === activeTense);
  const formalLabels = canonicalTense?.forms.map((f) =>
    f.terminology ? formalGrammarLabel(f.terminology) : undefined
  );

  if (!verb) {
    return (
      <div className="min-h-screen">
        <PageHeader title="Verb not found" onBack={onBack} />
      </div>
    );
  }

  const c = colorMap[verb.color];
  const hasVerifiedConjugation = availableTenses.length > 0;

  return (
    <div className="min-h-screen">
      <PageHeader title={verb.infinitive} subtitle={verb.en} onBack={onBack} />
      <div className="page-shell-body space-y-4">
        <GrammarVerbNav verbId={verbId} onSelect={onNavigate} verifiedOnly />

        <div className={`rounded-3xl ${c.bgSoft} p-5 text-center border border-forest/5`}>
          <p className="font-display text-3xl font-bold text-forest dark:text-linen-100" lang="ro">
            {verb.infinitive}
          </p>
          <p className="mt-1 text-lg text-ink-700 dark:text-ink-300">{verb.en}</p>
        </div>

        {hasVerifiedConjugation ? (
          <>
            {coverageNote && (
              <p className="text-sm text-forest/60 dark:text-linen/60 text-center leading-relaxed px-2">
                {coverageNote}
              </p>
            )}

            {canonicalTense && (
              <p className="text-xs text-center text-forest/50 dark:text-linen/50">
                {safetyTierLabel(canonicalTense.safetyTier)}
              </p>
            )}

            {availableTenses.length > 1 && activeTense && (
              <GrammarTenseToggle tenses={availableTenses} active={activeTense} onChange={setTense} />
            )}

            {availableTenses.length === 1 && activeTense && (
              <p className="text-center text-xs font-semibold uppercase tracking-wide text-forest/50 dark:text-linen/50">
                {GRAMMAR_TENSE_LABELS[activeTense]}
              </p>
            )}

            {forms && forms.length > 0 && activeTense ? (
              <GrammarConjugationCards
                title={GRAMMAR_TENSE_LABELS[activeTense]}
                forms={forms}
                idPrefix={`${verb.id}-${activeTense}`}
                formalLabels={formalLabels}
              />
            ) : null}

            {examples.length > 0 && activeTense && (
              <section>
                <h2 className="text-lg font-bold text-ink-900 dark:text-sand-100 mb-3">Examples</h2>
                <GrammarExamples examples={examples} idPrefix={`${verb.id}-${activeTense}`} />
              </section>
            )}
          </>
        ) : (
          <Card className="p-5 text-center space-y-2">
            <p className="text-ink-700 dark:text-ink-300 leading-relaxed">
              Conjugation tables appear here once each form has been individually verified in a Romanian
              dictionary. The infinitive is shown above — no forms are guessed from patterns.
            </p>
            <p className="text-sm text-ink-500 dark:text-ink-400">
              See <span className="font-semibold">Understanding Romanian tenses</span> for how tenses work in general.
            </p>
          </Card>
        )}

        {verb.review?.needsReview && (
          <p className="text-xs text-sun-500 dark:text-sun-300 text-center flex items-center justify-center gap-1">
            <Icon name="Lightbulb" className="h-4 w-4" />
            {verb.review.reviewReason}
          </p>
        )}
      </div>
    </div>
  );
}
