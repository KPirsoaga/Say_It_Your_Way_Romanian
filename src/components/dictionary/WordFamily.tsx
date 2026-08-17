import { Button } from '../Button';
import { Icon } from '../Icon';
import { FlagForMihaela } from '../FlagForMihaela';
import { userFlagId } from '../../content/review/reviewIds';
import type { DictionaryAdjectiveFamily, DictionaryNounFamily, DictionaryVerbFamily } from '../../content/dictionary/types';
import type { GrammarTense } from '../../types';
import { GRAMMAR_TENSE_ORDER } from '../../content/dictionary/types';

interface Props {
  nounFamily?: DictionaryNounFamily;
  verbFamily?: DictionaryVerbFamily;
  adjectiveFamily?: DictionaryAdjectiveFamily;
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
  selectedTense = 'present',
  onTenseChange,
  onPlay,
  playingId,
}: Props) {
  if (nounFamily) {
    return (
      <div className="space-y-3">
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
        <FormRow label="Definite singular" form={nounFamily.definiteSingular} audioId="nf-def-sg" onPlay={onPlay} playingId={playingId} />
        <FormRow label="Definite plural" form={nounFamily.definitePlural} audioId="nf-def-pl" onPlay={onPlay} playingId={playingId} />
      </div>
    );
  }

  if (verbFamily) {
    const tenseForms =
      selectedTense === 'present'
        ? verbFamily.present
        : selectedTense === 'perfect-compus'
          ? verbFamily.perfectCompus
          : selectedTense === 'imperfect'
            ? verbFamily.imperfect
            : verbFamily.future;

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
                {tense === 'perfect-compus' ? 'Perfect compus' : tense.charAt(0).toUpperCase() + tense.slice(1)}
              </button>
            ))}
          </div>
        )}
        <div className="space-y-2">
          {tenseForms?.map((form, i) => (
            <FormRow
              key={`${form.label}-${i}`}
              label={form.label}
              form={form}
              audioId={`vf-${selectedTense}-${i}`}
              onPlay={onPlay}
              playingId={playingId}
            />
          )) ?? (
            <p className="text-sm text-ink-500 dark:text-ink-300">More tense forms coming in Grammar Help.</p>
          )}
        </div>
      </div>
    );
  }

  if (adjectiveFamily) {
    return (
      <div className="space-y-3">
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

export function WordFamilyChain({ chain }: { chain: string[] }) {
  if (chain.length < 2) return null;
  return (
    <p className="text-sm text-ink-600 dark:text-ink-300">
      Word family: {chain.join(' → ')}
    </p>
  );
}
