import { Button } from '../Button';
import { Icon } from '../Icon';
import { FlagForTeacher } from '../FlagForTeacher';
import { WordFamilyChain as BrandWordFamilyChain } from '../brand/WordFamilyChain';
import { userFlagId } from '../../content/review/reviewIds';
import {
  adjectiveFamilyChain,
  learnerPersonLabel,
  learnerVisibleTensesForVerb,
  nounFamilyChain,
  verbPresentChain,
  verifiedTenseCoverageLabel,
} from '../../content/dictionary/familyUtils';
import type { DictionaryAdjectiveFamily, DictionaryNounFamily, DictionaryVerbFamily } from '../../content/dictionary/types';
import { GRAMMAR_TENSE_LABELS } from '../../content/dictionary/types';
import { getCanonicalVerb } from '../../content/lexical/canonical';
import {
  adjectiveFormTerminology,
  formalGrammarLabel,
  nounFormTerminology,
} from '../../content/lexical/canonical/terminology';
import { safetyTierLabel } from '../../content/validation/lexicalSafety';
import type { GrammarTense } from '../../types';

interface Props {
  nounFamily?: DictionaryNounFamily;
  verbFamily?: DictionaryVerbFamily;
  adjectiveFamily?: DictionaryAdjectiveFamily;
  familyComplete?: boolean;
  selectedTense?: GrammarTense;
  onTenseChange?: (tense: GrammarTense) => void;
  onPlay?: (ro: string, id: string) => void;
  playingId?: string | null;
}

function FormRow({
  label,
  form,
  audioId,
  onPlay,
  playingId,
  formalLabel,
}: {
  label: string;
  form?: { ro: string; en: string; pron?: string };
  audioId: string;
  onPlay?: (ro: string, id: string) => void;
  playingId?: string | null;
  formalLabel?: string;
}) {
  if (!form) return null;
  const playing = playingId === audioId;
  return (
    <div className="rounded-2xl border border-forest/8 dark:border-linen/10 bg-linen-50/80 dark:bg-forest-800/50 p-3 space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-forest/50 dark:text-linen/50">{label}</p>
      {formalLabel && (
        <p className="text-xs text-forest/45 dark:text-linen/45">{formalLabel}</p>
      )}
      <p className="text-lg font-semibold text-forest dark:text-linen-100" lang="ro">{form.ro}</p>
      <p className="text-sm text-forest/70 dark:text-linen/70">{form.en}</p>
      {onPlay && (
        <Button variant="ghost" size="md" className="!min-h-[40px] mt-1" onClick={() => onPlay(form.ro, audioId)}>
          <Icon name={playing ? 'Pause' : 'Volume2'} className="h-4 w-4" />
          Play
        </Button>
      )}
    </div>
  );
}

function ProvenanceBadge({ tier }: { tier: string }) {
  return (
    <span className="inline-block rounded-full bg-olive-50 dark:bg-olive-900/30 px-2.5 py-0.5 text-xs font-medium text-olive-700 dark:text-olive-300">
      {safetyTierLabel(tier as 'lexical-attested' | 'lexical-composed' | 'teacher-validated' | 'unresolved')}
    </span>
  );
}

export function WordFamily({
  nounFamily,
  verbFamily,
  adjectiveFamily,
  familyComplete = false,
  selectedTense = 'present',
  onTenseChange,
  onPlay,
  playingId,
}: Props) {
  if (nounFamily) {
    const chain = nounFamilyChain(nounFamily);
    const hasVerifiedForms = Boolean(
      familyComplete &&
        (nounFamily.plural || nounFamily.definiteSingular || nounFamily.definitePlural)
    );
    if (familyComplete && hasVerifiedForms) {
      const nounSlots = [
        { slot: 'singular' as const, label: 'Singular', form: nounFamily.singular },
        { slot: 'plural' as const, label: 'Plural', form: nounFamily.plural },
        { slot: 'definiteSingular' as const, label: 'The … (singular)', form: nounFamily.definiteSingular },
        { slot: 'definitePlural' as const, label: 'The … (plural)', form: nounFamily.definitePlural },
      ];
      return (
        <div className="space-y-3">
          {chain.length >= 2 && <BrandWordFamilyChain chain={chain} />}
          {nounFamily.gender && (
            <p className="text-sm text-forest/70 dark:text-linen/70">
              Gender: <span className="font-semibold capitalize">{nounFamily.gender}</span>
            </p>
          )}
          {nounFamily.articleNote && (
            <p className="text-sm text-forest/60 dark:text-linen/60 leading-relaxed">{nounFamily.articleNote}</p>
          )}
          <ProvenanceBadge tier="lexical-attested" />
          {nounSlots.map(({ slot, label, form }) => {
            const term = nounFormTerminology(slot);
            const formal = `${term.numberPlain}, ${term.definitenessPlain} (${term.caseFormal})`;
            return (
              <FormRow
                key={slot}
                label={label}
                formalLabel={formal}
                form={form}
                audioId={`nf-${slot}`}
                onPlay={onPlay}
                playingId={playingId}
              />
            );
          })}
        </div>
      );
    }
    if (!familyComplete) {
      return null;
    }
  }

  if (verbFamily?.present && verbFamily.present.length > 0 && verbFamily.grammarVerbId) {
    const visibleTenses = learnerVisibleTensesForVerb(verbFamily.grammarVerbId);
    if (visibleTenses.length === 0) return null;

    const activeTense = visibleTenses.includes(selectedTense) ? selectedTense : visibleTenses[0]!;
    const tenseForms =
      activeTense === 'present'
        ? verbFamily.present
        : activeTense === 'perfect-compus'
          ? verbFamily.perfectCompus
          : activeTense === 'imperfect'
            ? verbFamily.imperfect
            : verbFamily.future;

    const canonical = getCanonicalVerb(verbFamily.grammarVerbId, verbFamily.infinitive, verbFamily.en);
    const canonicalTense = canonical?.tenses.find((t) => t.tense === activeTense);

    const chain =
      activeTense === 'present'
        ? verbPresentChain(verbFamily)
        : [verbFamily.infinitive, ...(tenseForms?.map((f) => f.ro) ?? [])];

    const coverageNote = verifiedTenseCoverageLabel(verbFamily.grammarVerbId);

    return (
      <div className="space-y-3">
        {coverageNote && (
          <p className="text-sm text-forest/60 dark:text-linen/60 leading-relaxed">{coverageNote}</p>
        )}
        {onTenseChange && visibleTenses.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {visibleTenses.map((tense) => (
              <button
                key={tense}
                type="button"
                onClick={() => onTenseChange(tense)}
                className={`filter-chip ${activeTense === tense ? 'filter-chip-active' : 'filter-chip-inactive'}`}
              >
                {GRAMMAR_TENSE_LABELS[tense]}
              </button>
            ))}
          </div>
        )}
        {visibleTenses.length === 1 && (
          <p className="text-xs font-semibold uppercase tracking-wide text-forest/50 dark:text-linen/50">
            {GRAMMAR_TENSE_LABELS[visibleTenses[0]!]}
          </p>
        )}
        {canonicalTense && <ProvenanceBadge tier={canonicalTense.safetyTier} />}
        {chain.length >= 2 && <BrandWordFamilyChain chain={chain} label="Same verb, different forms" />}
        <div className="space-y-2">
          {tenseForms?.map((form, i) => {
            const canonForm = canonicalTense?.forms[i];
            const formal = canonForm?.terminology ? formalGrammarLabel(canonForm.terminology) : undefined;
            return (
              <FormRow
                key={`${form.label}-${i}`}
                label={learnerPersonLabel(form.label)}
                formalLabel={formal}
                form={form}
                audioId={`vf-${activeTense}-${i}`}
                onPlay={onPlay}
                playingId={playingId}
              />
            );
          })}
        </div>
      </div>
    );
  }

  if (adjectiveFamily && familyComplete) {
    const chain = adjectiveFamilyChain(adjectiveFamily);
    const adjSlots = [
      { slot: 'masculineSingular' as const, label: 'Masculine singular', form: adjectiveFamily.masculineSingular },
      { slot: 'feminineSingular' as const, label: 'Feminine singular', form: adjectiveFamily.feminineSingular },
      { slot: 'masculinePlural' as const, label: 'Masculine plural', form: adjectiveFamily.masculinePlural },
      { slot: 'femininePlural' as const, label: 'Feminine plural', form: adjectiveFamily.femininePlural },
    ];
    return (
      <div className="space-y-3">
        <BrandWordFamilyChain chain={chain} label="Same adjective, different forms" />
        <ProvenanceBadge tier="lexical-attested" />
        {adjSlots.map(({ slot, label, form }) => {
          const term = adjectiveFormTerminology(slot);
          const formal = `${term.genderFormal}, ${term.numberFormal}`;
          return (
            <FormRow
              key={slot}
              label={label}
              formalLabel={formal}
              form={form}
              audioId={`af-${slot}`}
              onPlay={onPlay}
              playingId={playingId}
            />
          );
        })}
      </div>
    );
  }

  return null;
}

export function DictionaryFlag({
  entryId,
  ro,
  en,
  contextLabel,
}: {
  entryId: string;
  ro: string;
  en: string;
  contextLabel: string;
}) {
  return (
    <FlagForTeacher
      id={userFlagId(`dictionary:${entryId}`)}
      ro={ro}
      en={en}
      contentArea="Vocabulary"
      contextLabel={contextLabel}
    />
  );
}

/** @deprecated Use `WordFamilyChain` from `components/brand/WordFamilyChain` */
export { WordFamilyChain } from '../brand/WordFamilyChain';
