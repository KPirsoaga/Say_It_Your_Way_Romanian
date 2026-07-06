import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Toggle } from '../components/Toggle';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { useSettings } from '../context/SettingsContext';
import { useReview } from '../context/ReviewContext';
import type { TextSize } from '../types';

interface Props {
  onBack: () => void;
  onOpenReview: () => void;
  onOpenShare: () => void;
}

const textSizeOptions: { value: TextSize; label: string; sample: string }[] = [
  { value: 'normal', label: 'Normal', sample: 'Aa' },
  { value: 'large', label: 'Large', sample: 'Aa' },
  { value: 'xlarge', label: 'Extra large', sample: 'Aa' },
];

export function SettingsPage({ onBack, onOpenReview, onOpenShare }: Props) {
  const { settings, update, reset } = useSettings();
  const { counts } = useReview();
  const toReview = counts.pending + counts.needsChanges;

  return (
    <div className="min-h-screen">
      <PageHeader title="Settings" subtitle="Make it comfortable for you" onBack={onBack} />
      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-4">
        <p className="text-ink-500 dark:text-ink-300 text-base">
          Adjust anything here to make reading and practising easier. Your choices are saved on this device.
        </p>

        {/* Text size */}
        <Card>
          <p className="font-bold text-ink-900 dark:text-sand-100 mb-3">Text size</p>
          <div className="grid grid-cols-3 gap-2 tile-grid">
            {textSizeOptions.map((opt) => {
              const active = settings.textSize === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update('textSize', opt.value)}
                  aria-pressed={active}
                  className={`rounded-2xl p-3 flex flex-col items-center gap-1 transition border-2 ${
                    active
                      ? 'border-sea-500 bg-sea-50 dark:bg-sea-600/20'
                      : 'border-transparent bg-sand-100 dark:bg-ink-900 dark:border-white/10'
                  }`}
                >
                  <span
                    className={`font-bold text-ink-900 dark:text-sand-100 ${
                      opt.value === 'large' ? 'text-2xl' : opt.value === 'xlarge' ? 'text-3xl' : 'text-xl'
                    }`}
                  >
                    {opt.sample}
                  </span>
                  <span className="text-xs text-ink-500 dark:text-ink-300">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Toggles */}
        <Card className="space-y-1">
          <Toggle
            label="Show pronunciation help"
            checked={settings.pronunciationHelp}
            onChange={(v) => update('pronunciationHelp', v)}
          />
          <Divider />
          <Toggle
            label="Show literal translation"
            checked={settings.literalTranslation}
            onChange={(v) => update('literalTranslation', v)}
          />
          <Divider />
          <Toggle
            label="Reduce animations"
            checked={settings.reduceAnimations}
            onChange={(v) => update('reduceAnimations', v)}
          />
          <Divider />
          <Toggle label="Dark mode" checked={settings.darkMode} onChange={(v) => update('darkMode', v)} />
        </Card>

        {/* Preview */}
        <Card>
          <p className="font-bold text-ink-900 dark:text-sand-100 mb-2">Preview</p>
          <p className="text-xl font-bold text-ink-900 dark:text-sand-100" lang="ro">
            Bună dimineața!
          </p>
          <p className="text-ink-700 dark:text-ink-300">Good morning!</p>
          {settings.pronunciationHelp && (
            <p className="text-sea-600 dark:text-sea-200 italic mt-1">BOO-nuh deem-yah-NAY-tuh!</p>
          )}
          {settings.literalTranslation && (
            <p className="text-ink-500 dark:text-ink-300 text-sm mt-1">
              <span className="font-bold">Literal:</span> Good morning!
            </p>
          )}
        </Card>

        <Card>
          <p className="font-bold text-ink-900 dark:text-sand-100 mb-1">Share with Teacher</p>
          <p className="text-sm text-ink-500 dark:text-ink-300 mb-3">
            Offline QR codes to share review items or progress with Mihaela during lessons.
          </p>
          <Button variant="soft" size="lg" className="w-full" onClick={onOpenShare}>
            <Icon name="Share2" className="h-5 w-5" />
            Share with Teacher
          </Button>
        </Card>

        <Card>
          <p className="font-bold text-ink-900 dark:text-sand-100 mb-1">Maintenance / Review</p>
          <p className="text-sm text-ink-500 dark:text-ink-300 mb-3">
            Check Romanian content with Mihaela during lessons. Decisions save on this device.
          </p>
          <Button variant="soft" size="lg" className="w-full" onClick={onOpenReview}>
            <Icon name="BookOpen" className="h-5 w-5" />
            Mihaela Review
            {toReview > 0 && (
              <span className="ml-auto rounded-full bg-coral-400 text-white text-xs font-bold px-2.5 py-0.5">
                {toReview}
              </span>
            )}
          </Button>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            <span className="text-sun-400 font-bold">{counts.pending} pending</span>
            <span className="text-sea-600 dark:text-sea-200 font-bold">{counts.approved} approved</span>
            <span className="text-coral-400 font-bold">{counts.needsChanges} changes</span>
          </div>
        </Card>

        <Button variant="ghost" size="md" className="w-full" onClick={onBack}>
          <Icon name="Home" className="h-5 w-5" />
          Back to home
        </Button>

        <Button variant="ghost" size="md" className="w-full" onClick={reset}>
          <Icon name="RotateCcw" className="h-5 w-5" />
          Reset settings to defaults
        </Button>

        <p className="text-center text-xs text-ink-300 dark:text-ink-500 pt-4">
          Say It Your Way Romanian · A calm space to practise Romanian
        </p>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-sand-200 dark:bg-white/10" />;
}
