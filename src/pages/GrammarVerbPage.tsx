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
import type { GrammarTense } from '../types';
import { GRAMMAR_TENSE_LABELS } from '../types';

interface Props {
  verbId: string;
  onBack: () => void;
  onNavigate: (verbId: string) => void;
}

export function GrammarVerbPage({ verbId, onBack, onNavigate }: Props) {
  const verb = grammarVerbs.find((v) => v.id === verbId);
  const availableTenses = useMemo(() => (verb ? getAvailableTenses(verb) : ['present' as GrammarTense]), [verb]);
  const [tense, setTense] = useState<GrammarTense>('present');

  useEffect(() => {
    setTense('present');
  }, [verbId]);

  const activeTense = availableTenses.includes(tense) ? tense : availableTenses[0];
  const forms = verb ? getVerbFormsForTense(verb, activeTense) : undefined;
  const examples = verb ? getVerbExamplesForTense(verb, activeTense) : [];

  if (!verb) {
    return (
      <div className="min-h-screen">
        <PageHeader title="Verb not found" onBack={onBack} />
      </div>
    );
  }

  const c = colorMap[verb.color];

  return (
    <div className="min-h-screen">
      <PageHeader title={verb.infinitive} subtitle={verb.en} onBack={onBack} />
      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-4">
        <GrammarVerbNav verbId={verbId} onSelect={onNavigate} />

        <div className={`rounded-3xl ${c.bgSoft} p-5 text-center border border-forest/5`}>
          <p className="font-display text-3xl font-bold text-forest dark:text-linen-100" lang="ro">
            {verb.infinitive}
          </p>
          <p className="mt-1 text-lg text-ink-700 dark:text-ink-300">{verb.en}</p>
        </div>

        <GrammarTenseToggle tenses={availableTenses} active={activeTense} onChange={setTense} />

        {forms && forms.length > 0 ? (
          <GrammarConjugationCards
            title={GRAMMAR_TENSE_LABELS[activeTense]}
            forms={forms}
            idPrefix={`${verb.id}-${activeTense}`}
          />
        ) : (
          <Card className="p-4 text-center text-ink-600 dark:text-ink-300">
            No conjugation table for this tense yet. See Understanding Romanian Tenses for how it works.
          </Card>
        )}

        <section>
          <h2 className="text-lg font-bold text-ink-900 dark:text-sand-100 mb-3">Examples</h2>
          <GrammarExamples examples={examples} idPrefix={`${verb.id}-${activeTense}`} />
        </section>

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
