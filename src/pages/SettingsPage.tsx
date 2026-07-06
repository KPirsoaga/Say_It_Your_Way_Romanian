import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Toggle } from '../components/Toggle';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { useSettings } from '../context/SettingsContext';
import type { TextSize } from '../types';

interface Props {
  onBack: () => void;
}

const textSizeOptions: { value: TextSize; label: string; sample: string }[] = [
  { value: 'normal', label: 'Normal', sample: 'Aa' },
  { value: 'large', label: 'Large', sample: 'Aa' },
  { value: 'xlarge', label: 'Extra large', sample: 'Aa' },
];

export function SettingsPage({ onBack }: Props) {
  const { settings, update, reset } = useSettings();

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
