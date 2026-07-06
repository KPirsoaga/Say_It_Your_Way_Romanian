import { useState } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { QrScanner } from '../../components/qr/QrScanner';
import { useQrCollector } from '../../hooks/useQrCollector';
import { useScannerSafeBack } from '../../hooks/useScannerSafeBack';
import { parseProgressExportPayload } from '../../services/qr/progressPackage';
import type { ProgressExportPayload } from '../../services/qr/types';

interface Props {
  onBack: () => void;
}

export function TeacherProgressPage({ onBack }: Props) {
  const [data, setData] = useState<ProgressExportPayload | null>(null);
  const { handleBack, registerScannerStop } = useScannerSafeBack(onBack);

  const { handleScan, progress, error, reset } = useQrCollector('progress-export', (items) => {
    setData(parseProgressExportPayload(items));
  });

  return (
    <div className="min-h-screen">
      <PageHeader title="Katie's progress" subtitle="Read-only dashboard" onBack={handleBack} />
      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-4">
        {!data ? (
          <>
            <Card>
              <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
                Scan Katie&apos;s progress QR before the lesson. You will see vocabulary, reading, exercises, and what needs review.
              </p>
            </Card>
            <QrScanner onScan={handleScan} onRegisterStop={registerScannerStop} />
            {progress && (
              <p className="text-sm font-bold text-sea-600 dark:text-sea-200 text-center">
                Scanned {progress.received} of {progress.total} QR codes
              </p>
            )}
            {error && (
              <p className="text-sm text-coral-500 text-center" role="alert">
                {error}
              </p>
            )}
          </>
        ) : (
          <>
            <ProgressDashboard data={data} />
            <Button variant="soft" size="lg" className="w-full" onClick={() => { setData(null); reset(); }}>
              Scan another progress QR
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function ProgressDashboard({ data }: { data: ProgressExportPayload }) {
  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-sea-50 to-white dark:from-ink-900 dark:to-ink-900">
        <p className="text-sm font-bold text-sea-600 dark:text-sea-200 uppercase tracking-wide">{data.learnerName}</p>
        <h2 className="text-2xl font-bold text-ink-900 dark:text-sand-100 mt-1">{data.currentWeeklyTopic.title}</h2>
        {data.lastPracticeDate && (
          <p className="text-sm text-ink-500 dark:text-ink-300 mt-2">
            Last practice: {data.lastPracticeDate}
            {data.practiceStreak > 0 && ` · ${data.practiceStreak}-day streak`}
          </p>
        )}
      </Card>

      <Card>
        <p className="font-bold text-ink-900 dark:text-sand-100 mb-3">Weekly lesson</p>
        <ProgressBar label="Vocabulary" percent={data.vocabularyPercent} />
        <ProgressBar label="Reading" percent={data.readingPercent} />
        <ProgressBar label="Exercises" percent={data.exercisesPercent} />
      </Card>

      {data.grammarFocus && (
        <Card>
          <p className="font-bold text-ink-900 dark:text-sand-100 mb-2">Grammar</p>
          <p className="text-sm text-ink-600 dark:text-ink-300 mb-3">{data.grammarFocus}</p>
          <div className="flex flex-wrap gap-2">
            {data.grammarTenses.map((t) => (
              <span
                key={t.label}
                className={`rounded-full px-3 py-1.5 text-sm font-bold ${
                  t.practiced
                    ? 'bg-sea-50 text-sea-600 dark:bg-sea-600/20 dark:text-sea-200'
                    : 'bg-sand-100 text-ink-500 dark:bg-ink-900 dark:text-ink-400'
                }`}
              >
                {t.label} {t.practiced ? '✓' : '✗'}
              </span>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <p className="font-bold text-ink-900 dark:text-sand-100 mb-3">Practice summary</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Stat label="Phrase builder" value={String(data.phraseBuilderDone)} />
          <Stat label="Conversations" value={String(data.miniConversationsDone)} />
          <Stat label="Practice days" value={String(data.practiceDays)} />
          <Stat label="Needs review" value={String(data.needsReviewCount)} />
        </div>
      </Card>

      {data.difficultVerbs.length > 0 && (
        <Card>
          <p className="font-bold text-ink-900 dark:text-sand-100 mb-2">Most difficult verbs</p>
          <ul className="space-y-1">
            {data.difficultVerbs.map((v) => (
              <li key={v} className="text-base font-bold text-ink-800 dark:text-sand-100" lang="ro">
                {v}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {data.topFlaggedItems.length > 0 && (
        <Card>
          <p className="font-bold text-ink-900 dark:text-sand-100 mb-3">Flagged for review</p>
          <div className="space-y-3">
            {data.topFlaggedItems.map((item, i) => (
              <div key={i} className="rounded-2xl bg-sand-100 dark:bg-ink-900 p-3">
                <p className="font-bold text-ink-900 dark:text-sand-100" lang="ro">
                  {item.ro}
                </p>
                <p className="text-sm text-ink-600 dark:text-ink-300">{item.en}</p>
                <p className="text-xs text-ink-500 mt-1">{item.reason}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {data.recentActivities.length > 0 && (
        <Card>
          <p className="font-bold text-ink-900 dark:text-sand-100 mb-2">Recently completed</p>
          <ul className="space-y-1 text-sm text-ink-600 dark:text-ink-300">
            {data.recentActivities.map((a) => (
              <li key={a} className="flex items-center gap-2">
                <Icon name="Check" className="h-4 w-4 text-sea-600 shrink-0" />
                {a}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

function ProgressBar({ label, percent }: { label: string; percent: number }) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-bold text-ink-700 dark:text-ink-300">{label}</span>
        <span className="font-bold text-sea-600 dark:text-sea-200">{percent}%</span>
      </div>
      <div className="h-3 rounded-full bg-sand-200 dark:bg-white/10 overflow-hidden">
        <div className="h-full bg-sea-500 rounded-full transition-all" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-sand-100 dark:bg-ink-900 p-3 text-center">
      <p className="text-xl font-bold text-ink-900 dark:text-sand-100">{value}</p>
      <p className="text-xs font-bold text-ink-500 dark:text-ink-400 mt-0.5">{label}</p>
    </div>
  );
}
