import { useState } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { QrScanner } from '../../components/qr/QrScanner';
import { useQrCollector } from '../../hooks/useQrCollector';
import { useScannerSafeBack } from '../../hooks/useScannerSafeBack';
import { useReview } from '../../context/ReviewContext';
import { parseReviewResponsePayload } from '../../services/qr/reviewPackage';

interface Props {
  onBack: () => void;
  onDone: () => void;
}

export function ReviewImportPage({ onBack, onDone }: Props) {
  const { applyReviewResponse } = useReview();
  const [applied, setApplied] = useState(0);
  const { handleBack, registerScannerStop } = useScannerSafeBack(onBack);

  const { handleScan, progress, error, success, reset } = useQrCollector('review-response', (items) => {
    const parsed = parseReviewResponsePayload(items);
    const count = applyReviewResponse(parsed);
    setApplied(count);
  });

  return (
    <div className="min-h-screen">
      <PageHeader title="Return review" subtitle="Scan Mihaela's response QR" onBack={handleBack} />
      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-4">
        {!success ? (
          <>
            <Card>
              <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
                After Mihaela reviews, scan her response QR here. Your review list updates automatically — no duplicates.
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
          <Card className="text-center py-8 space-y-3">
            <Icon name="Check" className="h-12 w-12 text-sea-600 dark:text-sea-200 mx-auto" />
            <p className="font-bold text-ink-900 dark:text-sand-100 text-xl">Review updated</p>
            <p className="text-sm text-ink-500 dark:text-ink-300">
              {applied} item{applied === 1 ? '' : 's'} matched and updated on this device.
            </p>
            <Button variant="primary" size="lg" className="w-full" onClick={onDone}>
              Open Mihaela Review
            </Button>
            <Button variant="ghost" size="md" className="w-full" onClick={reset}>
              Scan another code
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
