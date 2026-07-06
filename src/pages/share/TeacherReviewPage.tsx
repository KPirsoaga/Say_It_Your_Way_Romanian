import { useCallback, useMemo, useState } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { QrScanner } from '../../components/qr/QrScanner';
import { MultiQrPanel } from '../../components/qr/MultiQrPanel';
import { useQrCollector } from '../../hooks/useQrCollector';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useScannerSafeBack } from '../../hooks/useScannerSafeBack';
import {
  encodeReviewResponse,
  parseReviewExportPayload,
} from '../../services/qr/reviewPackage';
import type { ReviewExportItem, ReviewResponseItem } from '../../services/qr/types';
import type { ReviewStatus } from '../../types';

interface TeacherResponse {
  status: ReviewStatus;
  note?: string;
  cro?: string;
  cen?: string;
  pron?: string;
}

interface TeacherSession {
  items: ReviewExportItem[];
  responses: Record<string, TeacherResponse>;
}

const EMPTY_SESSION: TeacherSession = { items: [], responses: {} };

type Step = 'scan' | 'review' | 'export';

interface Props {
  onBack: () => void;
}

export function TeacherReviewPage({ onBack }: Props) {
  const [session, setSession] = useLocalStorage<TeacherSession>('rcd-teacher-review', EMPTY_SESSION);
  const [step, setStep] = useState<Step>(session.items.length > 0 ? 'review' : 'scan');
  const { handleBack, registerScannerStop } = useScannerSafeBack(onBack);

  const onPackageReady = useCallback(
    (items: unknown[]) => {
      const parsed = parseReviewExportPayload(items);
      const responses: Record<string, TeacherResponse> = {};
      parsed.forEach((item) => {
        responses[item.id] = { status: item.status };
      });
      setSession({ items: parsed, responses });
      setStep('review');
    },
    [setSession]
  );

  const { handleScan, progress, error, reset: resetScan, lastRaw } = useQrCollector('review-export', onPackageReady);

  const updateResponse = (id: string, patch: Partial<TeacherResponse>) => {
    setSession((prev) => ({
      ...prev,
      responses: {
        ...prev.responses,
        [id]: { ...prev.responses[id]!, ...patch },
      },
    }));
  };

  const responseItems: ReviewResponseItem[] = useMemo(
    () =>
      session.items.map((item) => {
        const r = session.responses[item.id] ?? { status: 'pending' as ReviewStatus };
        const row: ReviewResponseItem = { id: item.id, status: r.status };
        if (r.cro?.trim()) row.cro = r.cro.trim();
        if (r.cen?.trim()) row.cen = r.cen.trim();
        if (r.note?.trim()) row.note = r.note.trim();
        if (r.pron?.trim()) row.pron = r.pron.trim();
        return row;
      }),
    [session]
  );

  const responseCodes = useMemo(() => encodeReviewResponse(responseItems), [responseItems]);

  const clearSession = () => {
    setSession(EMPTY_SESSION);
    resetScan();
    setStep('scan');
  };

  return (
    <div className="min-h-screen">
      <PageHeader title="Teacher review" subtitle="Mihaela — scan and review" onBack={handleBack} />
      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-4">
        {step === 'scan' && (
          <>
            <Card>
              <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
                Scan Katie&apos;s review QR code(s). You will see every flagged Romanian item. Your edits stay on this device until you generate a response QR.
              </p>
            </Card>
            <QrScanner onScan={handleScan} onRegisterStop={registerScannerStop} />
            {progress && (
              <p className="text-sm font-bold text-sea-600 dark:text-sea-200 text-center">
                Scanned {progress.received} of {progress.total} QR codes
              </p>
            )}
            {error && (
              <div className="rounded-2xl bg-coral-50 dark:bg-coral-400/10 p-3 space-y-1" role="alert">
                <p className="text-sm font-bold text-coral-500">{error}</p>
                {lastRaw && (
                  <p className="text-xs text-ink-500 dark:text-ink-400 font-mono break-all">Received: {lastRaw}</p>
                )}
              </div>
            )}
          </>
        )}

        {step === 'review' && (
          <>
            <Card className="flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-ink-700 dark:text-ink-300">
                {session.items.length} item{session.items.length === 1 ? '' : 's'} to review
              </p>
              <Button variant="ghost" size="md" onClick={clearSession}>
                Scan new package
              </Button>
            </Card>

            <div className="space-y-4">
              {session.items.map((item) => (
                <TeacherReviewCard
                  key={item.id}
                  item={item}
                  response={session.responses[item.id] ?? { status: item.status }}
                  onChange={(patch) => updateResponse(item.id, patch)}
                />
              ))}
            </div>

            <Button variant="primary" size="lg" className="w-full" onClick={() => setStep('export')}>
              <Icon name="QrCode" className="h-5 w-5" />
              Generate review response
            </Button>
          </>
        )}

        {step === 'export' && (
          <>
            <Card>
              <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
                Show this QR to Katie. She scans it in <span className="font-bold">Return review</span> and her list updates.
              </p>
            </Card>
            <MultiQrPanel codes={responseCodes} title="Review response" />
            <Button variant="soft" size="lg" className="w-full" onClick={() => setStep('review')}>
              Back to review list
            </Button>
            <Button variant="ghost" size="md" className="w-full" onClick={clearSession}>
              Start over
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function TeacherReviewCard({
  item,
  response,
  onChange,
}: {
  item: ReviewExportItem;
  response: TeacherResponse;
  onChange: (patch: Partial<TeacherResponse>) => void;
}) {
  return (
    <Card className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wide text-ink-500 dark:text-ink-300">
          {item.area}
        </span>
      </div>

      <div>
        <p className="text-xs font-bold text-ink-400 mb-1">Romanian</p>
        <p className="text-lg font-bold text-ink-900 dark:text-sand-100" lang="ro">
          {item.ro}
        </p>
      </div>
      <div>
        <p className="text-xs font-bold text-ink-400 mb-1">English</p>
        <p className="text-base text-ink-700 dark:text-ink-300">{item.en}</p>
      </div>

      <div className="rounded-2xl bg-sand-100 dark:bg-ink-900 p-3 text-sm">
        <p className="font-bold text-ink-500 text-xs uppercase mb-1">Why flagged</p>
        <p>{item.note ?? '—'}</p>
      </div>

      <label className="block">
        <span className="text-sm font-bold text-ink-700 dark:text-ink-300">Correct Romanian</span>
        <input
          type="text"
          value={response.cro ?? ''}
          onChange={(e) => onChange({ cro: e.target.value })}
          className="mt-1 w-full rounded-xl border border-sand-200 dark:border-white/10 bg-white dark:bg-ink-800 px-3 py-2.5 text-base"
          placeholder="Optional correction"
        />
      </label>

      <label className="block">
        <span className="text-sm font-bold text-ink-700 dark:text-ink-300">Correct English</span>
        <input
          type="text"
          value={response.cen ?? ''}
          onChange={(e) => onChange({ cen: e.target.value })}
          className="mt-1 w-full rounded-xl border border-sand-200 dark:border-white/10 bg-white dark:bg-ink-800 px-3 py-2.5 text-base"
          placeholder="Optional correction"
        />
      </label>

      <label className="block">
        <span className="text-sm font-bold text-ink-700 dark:text-ink-300">Teacher notes</span>
        <textarea
          value={response.note ?? ''}
          onChange={(e) => onChange({ note: e.target.value })}
          rows={2}
          className="mt-1 w-full rounded-xl border border-sand-200 dark:border-white/10 bg-white dark:bg-ink-800 px-3 py-2.5 text-base resize-none"
          placeholder="Notes for Katie"
        />
      </label>

      <label className="block">
        <span className="text-sm font-bold text-ink-700 dark:text-ink-300">Pronunciation notes</span>
        <input
          type="text"
          value={response.pron ?? ''}
          onChange={(e) => onChange({ pron: e.target.value })}
          className="mt-1 w-full rounded-xl border border-sand-200 dark:border-white/10 bg-white dark:bg-ink-800 px-3 py-2.5 text-base"
          placeholder="How to say it"
        />
      </label>

      <div className="flex flex-col gap-2">
        <Button
          variant={response.status === 'approved' ? 'primary' : 'outline'}
          size="lg"
          className="w-full"
          onClick={() => onChange({ status: 'approved' })}
        >
          <Icon name="Check" className="h-5 w-5" />
          Approve
        </Button>
        <Button
          variant={response.status === 'needs-changes' ? 'secondary' : 'outline'}
          size="lg"
          className="w-full"
          onClick={() => onChange({ status: 'needs-changes' })}
        >
          <Icon name="Wrench" className="h-5 w-5" />
          Needs changes
        </Button>
      </div>
    </Card>
  );
}
