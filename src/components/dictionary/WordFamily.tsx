import { Button } from '../Button';
import { Icon } from '../Icon';
import { FlagForMihaela } from '../FlagForMihaela';
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

function TransformationChain({ chain }: { chain: string[] }) {
  if (chain.length < 2) return null;
  return (
    <div className="rounded-2xl bg-sea-50 dark:bg-sea-600/10 px-4 py-3 overflow-x-auto">
      <p className="text-xs font-bold uppercase tracking-wide text-ink-500 dark:text-ink-300 mb-2">
        Same word, different forms
      </p>
      <p className="text-base font-bold text-ink-900 dark:text-sand-100 whitespace-nowrap" lang="ro">
        {chain.join(' → ')}
      </p>
    </div>
  );
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
    <div className="rounded-2xl bg-sand-50 dark:bg-ink-900 p-3 space-y-1">
      <p className="text-xs font-bold uppercase tracking-wide text-ink-500 dark:text-ink-300">{label}</p>
      <p className="text-lg font-bold text-ink-900 dark:text-sand-100" lang="ro">{form.ro}</p>
      <p className="text-sm text-ink-600 dark:text-ink-300">{form.en}</p>
      {onPlay && (
        <Button variant="soft" size="md" onClick={() => onPlay(form.ro, audioId)}>
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
  if (nounFamily && familyComplete) {
    const chain = nounFamilyChain(nounFamily);
    return (
      <div className="space-y-3">
        <TransformationChain chain={chain} />
        {nounFamily.gender && (
          <p className="text-sm text-ink-600 dark:text-ink-300">
            Gender: <span className="font-bold capitalize">{nounFamily.gender}</span>
          </p>
        )}
        {nounFamily.articleNote && (
          <p className="text-sm text-ink-500 dark:text-ink-400 leading-relaxed">{nounFamily.articleNote}</p>
        )}
        <FormRow label="Singular" form={nounFamily.singular} audioId="nf-sg" onPlay={onPlay} playingId={playingId} />
        <FormRow label="Plural" form={nounFamily.plural} audioId="nf-pl" onPlay={onPlay} playingId={playingId} />
        <FormRow label="The … (singular)" form={nounFamily.definiteSingular} audioId="nf-def-sg" onPlay={onPlay} playingId={playingId} />
        <FormRow label="The … (plural)" form={nounFamily.definitePlural} audioId="nf-def-pl" onPlay={onPlay} playingId={playingId} />
      </div>
    );
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

    const chain = selectedTense === 'present' ? verbPresentChain(verbFamily) : [verbFamily.infinitive, ...(tenseForms?.map((f) => f.ro) ?? [])];

    return (
      <div className="space-y-3">
        {onTenseChange && (
          <div className="flex flex-wrap gap-2">
            {GRAMMAR_TENSE_ORDER.map((tense) => (
              <button
                key={tense}
                type="button"
                onClick={() => onTenseChange(tense)}
                className={`rounded-full px-3 py-1.5 text-sm font-bold ${
                  selectedTense === tense
                    ? 'bg-sea-600 text-white dark:bg-sea-400 dark:text-ink-900'
                    : 'bg-sand-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300'
                }`}
              >
                {GRAMMAR_TENSE_LABELS[tense]}
              </button>
            ))}
          </div>
        )}
        {chain.length >= 2 && <TransformationChain chain={chain} />}
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
            <p className="text-sm text-ink-500 dark:text-ink-300">
              More forms for this tense are in Grammar Help.
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
        <TransformationChain chain={chain} />
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
    <FlagForMihaela
      id={userFlagId(`dictionary:${entryId}`)}
      ro={ro}
      en={en}
      contentArea="Vocabulary"
      contextLabel={contextLabel}
    />
  );
}

export function WordFamilyChain({ chain, prefix }: { chain: string[]; prefix?: string }) {
  if (chain.length < 2) return null;
  return (
    <p className="text-sm text-ink-600 dark:text-ink-300" lang="ro">
      {prefix ? `${prefix} ` : ''}{chain.join(' → ')}
    </p>
  );
}
