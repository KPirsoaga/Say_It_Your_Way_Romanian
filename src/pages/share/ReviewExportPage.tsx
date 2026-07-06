import { useMemo } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { MultiQrPanel } from '../../components/qr/MultiQrPanel';
import { useReview } from '../../context/ReviewContext';
import { buildReviewExportItems, encodeReviewExport } from '../../services/qr/reviewPackage';

interface Props {
  onBack: () => void;
}

export function ReviewExportPage({ onBack }: Props) {
  const { itemsToReview, getEffectiveStatus, decisions, manualFlags } = useReview();

  const exportItems = useMemo(
    () =>
      buildReviewExportItems(
        itemsToReview,
        getEffectiveStatus,
        decisions,
        Object.fromEntries(Object.entries(manualFlags).map(([id, f]) => [id, f.flaggedAt]))
      ),
    [itemsToReview, getEffectiveStatus, decisions, manualFlags]
  );

  const codes = useMemo(() => encodeReviewExport(exportItems), [exportItems]);

  return (
    <div className="min-h-screen">
      <PageHeader title="Share review items" subtitle="Show this QR to Mihaela" onBack={onBack} />
      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-4">
        {exportItems.length === 0 ? (
          <Card className="text-center py-8 space-y-3">
            <Icon name="Check" className="h-10 w-10 text-sea-600 dark:text-sea-200 mx-auto" />
            <p className="font-bold text-ink-900 dark:text-sand-100">Nothing to share right now</p>
            <p className="text-sm text-ink-500 dark:text-ink-300">
              Flag Romanian content or wait for pending review items to appear.
            </p>
            <Button variant="soft" size="lg" className="w-full" onClick={onBack}>
              Go back
            </Button>
          </Card>
        ) : (
          <>
            <Card>
              <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
                {exportItems.length} item{exportItems.length === 1 ? '' : 's'} ready. Ask Mihaela to open{' '}
                <span className="font-bold">Teacher review</span> and scan {codes.length > 1 ? 'each code' : 'this code'}.
              </p>
            </Card>
            <MultiQrPanel
              codes={codes}
              title="Review package"
              hint="Only review data is included — no settings or favourites."
            />
          </>
        )}
      </div>
    </div>
  );
}
