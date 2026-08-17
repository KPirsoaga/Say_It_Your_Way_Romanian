import { Button } from '../Button';
import { Icon } from '../Icon';
import { FlagForTeacher } from '../FlagForTeacher';
import { WordFamilyChain as BrandWordFamilyChain } from '../brand/WordFamilyChain';
import { userFlagId } from '../../content/review/reviewIds';
import {
  adjectiveFamilyChain,
  learnerPersonLabel,
  nounFamilyChain,
  verbPresentChain,
} from '../../content/dictionary/familyUtils';
import type { DictionaryAdjectiveFamily, DictionaryNounFamily, DictionaryVerbFamily } from '../../content/dictionary/types';
import { GRAMMAR_TENSE_LABELS, GRAMMAR_TENSE_ORDER } from '../../content/dictionary/types';
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
}: {
  label: string;
  form?: { ro: string; en: string; pron?: string };
  audioId: string;
  onPlay?: (ro: string, id: string) => void;
  playingId?: string | null;
}) {
  if (!form) return null;
  const playing = playingId === audioId;
  return (
    <div className="rounded-2xl border border-forest/8 dark:border-linen/10 bg-linen-50/80 dark:bg-forest-800/50 p-3 space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-forest/50 dark:text-linen/50">{label}</p>
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
          <FormRow label="Singular" form={nounFamily.singular} audioId="nf-sg" onPlay={onPlay} playingId={playingId} />
          <FormRow label="Plural" form={nounFamily.plural} audioId="nf-pl" onPlay={onPlay} playingId={playingId} />
          <FormRow label="The … (singular)" form={nounFamily.definiteSingular} audioId="nf-def-sg" onPlay={onPlay} playingId={playingId} />
          <FormRow label="The … (plural)" form={nounFamily.definitePlural} audioId="nf-def-pl" onPlay={onPlay} playingId={playingId} />
        </div>
      );
    }
    if (!familyComplete) {
      return (
        <div className="space-y-3">
          <FormRow label="Singular" form={nounFamily.singular} audioId="nf-sg" onPlay={onPlay} playingId={playingId} />
          <p className="text-sm text-forest/60 dark:text-linen/60 leading-relaxed">
            Other forms for this noun have not been individually verified yet.
          </p>
        </div>
      );
    }
  }

  if (verbFamily?.present && verbFamily.present.length > 0) {
    const tenseForms =
      selectedTense === 'present'
        ? verbFamily.present
        : selectedTense === 'perfect-compus'
          ? verbFamily.perfectCompus
          : selectedTense === 'imperfect'
            ? verbFamily.imperfect
            : verbFamily.future;

    const chain =
      selectedTense === 'present'
        ? verbPresentChain(verbFamily)
        : [verbFamily.infinitive, ...(tenseForms?.map((f) => f.ro) ?? [])];

    return (
      <div className="space-y-3">
        {onTenseChange && (
          <div className="flex flex-wrap gap-2">
            {GRAMMAR_TENSE_ORDER.map((tense) => (
              <button
                key={tense}
                type="button"
                onClick={() => onTenseChange(tense)}
                className={`filter-chip ${selectedTense === tense ? 'filter-chip-active' : 'filter-chip-inactive'}`}
              >
                {GRAMMAR_TENSE_LABELS[tense]}
              </button>
            ))}
          </div>
        )}
        {chain.length >= 2 && <BrandWordFamilyChain chain={chain} label="Same verb, different forms" />}
        <div className="space-y-2">
          {tenseForms?.map((form, i) => (
            <FormRow
              key={`${form.label}-${i}`}
              label={learnerPersonLabel(form.label)}
              form={form}
              audioId={`vf-${selectedTense}-${i}`}
              onPlay={onPlay}
              playingId={playingId}
            />
          )) ?? (
            <p className="text-sm text-forest/60 dark:text-linen/60">
              This tense is not available for this verb yet.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (adjectiveFamily && familyComplete) {
    const chain = adjectiveFamilyChain(adjectiveFamily);
    return (
      <div className="space-y-3">
        <BrandWordFamilyChain chain={chain} label="Same adjective, different forms" />
        <FormRow label="Masculine singular" form={adjectiveFamily.masculineSingular} audioId="af-ms" onPlay={onPlay} playingId={playingId} />
        <FormRow label="Feminine singular" form={adjectiveFamily.feminineSingular} audioId="af-fs" onPlay={onPlay} playingId={playingId} />
        <FormRow label="Masculine plural" form={adjectiveFamily.masculinePlural} audioId="af-mp" onPlay={onPlay} playingId={playingId} />
        <FormRow label="Feminine plural" form={adjectiveFamily.femininePlural} audioId="af-fp" onPlay={onPlay} playingId={playingId} />
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
